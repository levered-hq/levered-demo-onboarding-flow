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
export function buildLeadUpdateDto(
  stepSlug: string,
  answer: string | string[]
): LeadUpdateDto {
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
      dto.productInterest = (
        Array.isArray(answer) ? answer : [answer]
      ) as ProductInterestEnum[];
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
 * Call the lead routing API route
 */
export async function updateLeadFunnelStep(
  leadId: string,
  currentFunnelStep: BackendStepEnum,
  updateData: LeadUpdateDto
): Promise<LeadUpdatedDto> {
  try {
    // Construct the API URL
    const url = `/api/lead-routing/${leadId}/${currentFunnelStep}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
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
    throw error;
  }
}
