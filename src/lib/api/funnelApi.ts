import {
  BackendStepEnum,
  LeadUpdateDto,
  LeadUpdatedDto,
  IntentEnum,
  ProductInterestEnum,
  SelfSignupProductEnum,
} from "@/types/leadTypes";
import { mapStepSlugToBackend } from "@/lib/stepMapping";

/**
 * Build the LeadUpdateDto based on the current step and answer
 */
export function buildLeadUpdateDto(stepSlug: string, answer: string | string[]): LeadUpdateDto {
  const dto: LeadUpdateDto = {};

  switch (stepSlug) {
    case "employees":
      dto.numberOfEmployees = answer as any;
      break;
    case "registration-country":
      dto.registrationCountry = answer as string;
      break;
    case "corporate-form":
      dto.legalForm = answer as string;
      break;
    case "pick-solution":
      // Handle array of product interests
      dto.productInterest = (Array.isArray(answer) ? answer : [answer]) as ProductInterestEnum[];
      break;
    case "card-spend":
    case "card-spend-small":
      dto.cardSpend = answer as any;
      break;
    case "is-credit-required":
      dto.isCreditRequired = answer as any;
      break;
    case "number-of-invoices":
      dto.numberOfInvoices = answer as any;
      break;
    case "erp":
      dto.erpSystem = answer as string;
      break;
    case "funnel-intent":
      dto.funnelIntent = answer as IntentEnum;
      break;
    case "engagement-stage":
      dto.engagementStage = answer as any;
      break;
    default:
      console.warn(`Unhandled step in buildLeadUpdateDto: ${stepSlug}`);
  }

  return dto;
}

/**
 * Mock response for development (when Supabase is not connected)
 */
function getMockResponse(currentStep: BackendStepEnum, updateData: LeadUpdateDto): LeadUpdatedDto {
  console.warn("⚠️ Supabase not connected, using mock routing");

  // Simple mock progression logic
  const stepProgression: Record<BackendStepEnum, BackendStepEnum> = {
    email: "numberOfEmployees",
    numberOfEmployees: "registrationCountry",
    registrationCountry: "legalForm",
    legalForm: "productInterests",
    productInterests: "cardSpend",
    cardSpend: "isCreditRequired",
    cardSpendSmallSpender: "isCreditRequired",
    isCreditRequired: "numberOfInvoices",
    numberOfInvoices: "erpSystem",
    erpSystem: "demoBookingP1", // Default outcome
    funnelIntent: "demoBookingP1",
    engagementStage: "demoBookingP1",
    isMicroEntityTurnoverExceeded: "legalForm",
    waitlist: "waitlist",
    notForYou: "notForYou",
    demoBookingP0: "demoBookingP0",
    demoBookingP1: "demoBookingP1",
    demoBookingP2: "demoBookingP2",
    selfSignup: "selfSignup",
  };

  // Simple logic: route sole traders to self-signup
  if (currentStep === "numberOfEmployees" && updateData.numberOfEmployees === "1") {
    return {
      nextFunnelStep: "selfSignup",
      waitlistReason: null,
      selfSignupProduct: "CORPORATE_CARDS",
      intent: "SELF_SERVE",
      totalSteps: 9,
      stepNumber: 2,
    };
  }

  const nextStep = stepProgression[currentStep] || "demoBookingP1";
  const stepNumber = Object.keys(stepProgression).indexOf(currentStep) + 1;

  return {
    nextFunnelStep: nextStep,
    waitlistReason: null,
    intent: "UNKNOWN",
    totalSteps: 9,
    stepNumber,
  };
}

/**
 * Call the lead routing edge function
 */
export async function updateLeadFunnelStep(
  leadId: string,
  currentFunnelStep: BackendStepEnum,
  updateData: LeadUpdateDto
): Promise<LeadUpdatedDto> {
  // Check if Supabase is connected
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  
  if (!supabaseUrl) {
    // Return mock response until Supabase is connected
    return getMockResponse(currentFunnelStep, updateData);
  }

  try {
    // Construct the API URL
    const url = `${supabaseUrl}/functions/v1/lead-routing/${leadId}/${currentFunnelStep}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("API Error:", error);
      throw new Error(`API call failed: ${response.status}`);
    }

    const data: LeadUpdatedDto = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling lead routing API:", error);
    // Fallback to mock response on error
    return getMockResponse(currentFunnelStep, updateData);
  }
}
