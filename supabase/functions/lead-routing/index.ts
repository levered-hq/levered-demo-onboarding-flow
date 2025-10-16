// Lead Routing Edge Function
// Handles: PATCH /leads/{leadId}/funnel-step/{currentFunnelStep}

// Type definitions (matching API contract)
type BackendStepEnum =
  | "email"
  | "numberOfEmployees"
  | "registrationCountry"
  | "isMicroEntityTurnoverExceeded"
  | "legalForm"
  | "productInterests"
  | "cardSpend"
  | "cardSpendSmallSpender"
  | "isCreditRequired"
  | "numberOfInvoices"
  | "funnelIntent"
  | "engagementStage"
  | "erpSystem"
  | "waitlist"
  | "notForYou"
  | "demoBookingP0"
  | "demoBookingP1"
  | "demoBookingP2"
  | "selfSignup";

type IntentEnum = "SELF_SERVE" | "INTRO" | "PRICING" | "UNKNOWN" | "NEUTRAL";
type EmployeesEnum = "1" | "1 - 10" | "11 - 25" | "26 - 50" | "51 - 150" | "151 - 300" | ">300";
type ProductInterestEnum = "corporate-cards" | "accounts-payable" | "employee-reimbursement" | "I don't know";
type CardSpendEnum = "<1k" | "1k - 5k" | "5k - 10k" | "<10k" | "10k<" | "10k - 15k" | "15k - 30k" | "30k - 50k" | "50k - 200k" | ">200k";
type CreditRequiredEnum = "Yes" | "No";
type InvoicesEnum = "<20" | "20 - 100" | "101 - 200" | "201 - 500" | ">500";
type EngagementStageEnum = "HIGH_INTENT" | "CONSIDERATION_STAGE" | "LOW_INTENT_TESTER";
type SelfSignupProductEnum = "ACCOUNTS_PAYABLE" | "CORPORATE_CARDS" | "EMPLOYEE_REIMBURSEMENTS";

interface LeadUpdateDto {
  intent?: IntentEnum;
  numberOfEmployees?: EmployeesEnum;
  registrationCountry?: string;
  legalForm?: string;
  productInterest?: ProductInterestEnum[];
  cardSpend?: CardSpendEnum;
  isCreditRequired?: CreditRequiredEnum;
  numberOfInvoices?: InvoicesEnum;
  erpSystem?: string;
  funnelIntent?: IntentEnum;
  engagementStage?: EngagementStageEnum;
}

interface LeadUpdatedDto {
  nextFunnelStep: BackendStepEnum;
  waitlistReason: BackendStepEnum | null;
  selfSignupProduct?: SelfSignupProductEnum;
  intent: IntentEnum;
  totalSteps: number;
  stepNumber: number;
}

interface LeadData extends LeadUpdateDto {
  email?: string;
  currentStep?: BackendStepEnum;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supported countries
const SUPPORTED_COUNTRIES = new Set(["DE", "NL", "GB", "AT", "FR", "ES", "IT", "BE", "LU", "IE"]);

// Standard step order for progress calculation
const STEP_ORDER: BackendStepEnum[] = [
  "email",
  "numberOfEmployees",
  "registrationCountry",
  "legalForm",
  "productInterests",
  "cardSpend",
  "isCreditRequired",
  "numberOfInvoices",
  "erpSystem",
];

/**
 * Calculate routing score based on lead data
 */
function calculateLeadScore(leadData: LeadData): number {
  let score = 0;

  // Employee count score (0-30 points)
  switch (leadData.numberOfEmployees) {
    case ">300":
      score += 30;
      break;
    case "151 - 300":
      score += 25;
      break;
    case "51 - 150":
      score += 20;
      break;
    case "26 - 50":
      score += 15;
      break;
    case "11 - 25":
      score += 10;
      break;
    case "1 - 10":
      score += 5;
      break;
    case "1":
      score += 0;
      break;
  }

  // Card spend score (0-30 points)
  const spendValue = leadData.cardSpend;
  if (spendValue === ">200k") score += 30;
  else if (spendValue === "50k - 200k") score += 25;
  else if (spendValue === "30k - 50k") score += 20;
  else if (spendValue === "15k - 30k") score += 15;
  else if (spendValue === "10k - 15k" || spendValue === "10k<") score += 10;
  else if (spendValue === "5k - 10k" || spendValue === "<10k") score += 5;
  else score += 2;

  // Credit requirement score (0-20 points)
  if (leadData.isCreditRequired === "Yes") score += 20;
  else score += 5;

  // Invoice volume score (0-10 points)
  switch (leadData.numberOfInvoices) {
    case ">500":
      score += 10;
      break;
    case "201 - 500":
      score += 8;
      break;
    case "101 - 200":
      score += 6;
      break;
    case "20 - 100":
      score += 4;
      break;
    case "<20":
      score += 2;
      break;
  }

  // Product interest score (0-10 points)
  if (leadData.productInterest) {
    if (leadData.productInterest.length > 1) score += 10;
    else if (leadData.productInterest.length === 1 && leadData.productInterest[0] !== "I don't know") score += 5;
  }

  return score;
}

/**
 * Determine self-signup product based on lead data
 */
function determineSelfSignupProduct(leadData: LeadData): SelfSignupProductEnum {
  const interests = leadData.productInterest || [];

  // If high invoice volume, suggest AP
  if (leadData.numberOfInvoices === ">500" || leadData.numberOfInvoices === "201 - 500") {
    if (interests.includes("accounts-payable")) return "ACCOUNTS_PAYABLE";
  }

  // If single interest, use that
  if (interests.length === 1) {
    if (interests[0] === "accounts-payable") return "ACCOUNTS_PAYABLE";
    if (interests[0] === "employee-reimbursement") return "EMPLOYEE_REIMBURSEMENTS";
    if (interests[0] === "corporate-cards") return "CORPORATE_CARDS";
  }

  // Default to corporate cards
  return "CORPORATE_CARDS";
}

/**
 * Main routing logic - determines next step based on current step and lead data
 */
function determineNextStep(
  currentStep: BackendStepEnum,
  updateData: LeadUpdateDto,
  leadData: LeadData
): { nextStep: BackendStepEnum; waitlistReason: BackendStepEnum | null } {
  // Merge update data into lead data
  const updatedLeadData = { ...leadData, ...updateData };

  console.log("Routing logic:", { currentStep, updateData, leadData: updatedLeadData });

  // Step-by-step routing logic
  switch (currentStep) {
    case "email":
      return { nextStep: "numberOfEmployees", waitlistReason: null };

    case "numberOfEmployees":
      // Sole traders go directly to self-signup
      if (updateData.numberOfEmployees === "1") {
        return { nextStep: "selfSignup", waitlistReason: null };
      }
      return { nextStep: "registrationCountry", waitlistReason: null };

    case "registrationCountry":
      // Check if country is supported
      if (updateData.registrationCountry && !SUPPORTED_COUNTRIES.has(updateData.registrationCountry.toUpperCase())) {
        return { nextStep: "waitlist", waitlistReason: "registrationCountry" };
      }
      return { nextStep: "legalForm", waitlistReason: null };

    case "legalForm":
      return { nextStep: "productInterests", waitlistReason: null };

    case "productInterests":
      // Small companies go to small spender card spend options
      if (updatedLeadData.numberOfEmployees === "1 - 10" || updatedLeadData.numberOfEmployees === "11 - 25") {
        return { nextStep: "cardSpendSmallSpender", waitlistReason: null };
      }
      return { nextStep: "cardSpend", waitlistReason: null };

    case "cardSpend":
    case "cardSpendSmallSpender":
      return { nextStep: "isCreditRequired", waitlistReason: null };

    case "isCreditRequired":
      return { nextStep: "numberOfInvoices", waitlistReason: null };

    case "numberOfInvoices":
      return { nextStep: "erpSystem", waitlistReason: null };

    case "erpSystem":
      // Final routing decision based on lead score
      const score = calculateLeadScore(updatedLeadData);
      console.log("Lead score:", score);

      // High score: P0 demo (70+ points)
      if (score >= 70) {
        return { nextStep: "demoBookingP0", waitlistReason: null };
      }

      // Medium-high score: P1 demo (50-69 points)
      if (score >= 50) {
        return { nextStep: "demoBookingP1", waitlistReason: null };
      }

      // Medium score: P2 demo (30-49 points)
      if (score >= 30) {
        return { nextStep: "demoBookingP2", waitlistReason: null };
      }

      // Low score: Self-signup (< 30 points)
      return { nextStep: "selfSignup", waitlistReason: null };

    default:
      // For outcome steps, stay on that step
      return { nextStep: currentStep, waitlistReason: null };
  }
}

/**
 * Calculate progress information
 */
function calculateProgress(currentStep: BackendStepEnum): { stepNumber: number; totalSteps: number } {
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  return {
    stepNumber: stepIndex >= 0 ? stepIndex + 1 : 1,
    totalSteps: STEP_ORDER.length,
  };
}

/**
 * Main request handler
 */
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse URL path: /lead-routing/{leadId}/{currentFunnelStep}
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // Extract leadId and currentFunnelStep from path
    // Expected format: [..., 'lead-routing', leadId, currentFunnelStep]
    const leadId = pathParts[pathParts.length - 2];
    const currentFunnelStep = pathParts[pathParts.length - 1] as BackendStepEnum;

    console.log("Request:", { method: req.method, leadId, currentFunnelStep });

    if (!leadId || !currentFunnelStep) {
      return new Response(
        JSON.stringify({ error: "Missing leadId or currentFunnelStep in path" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const updateData: LeadUpdateDto = await req.json();
    console.log("Update data:", updateData);

    // In a real implementation, we would:
    // 1. Fetch existing lead data from database
    // 2. Validate the leadId exists
    // For now, we'll work with the provided data
    const leadData: LeadData = {
      email: "",
      currentStep: currentFunnelStep,
      ...updateData,
    };

    // Determine next step using routing logic
    const { nextStep, waitlistReason } = determineNextStep(currentFunnelStep, updateData, leadData);

    // Calculate progress
    const progress = calculateProgress(nextStep);

    // Determine intent based on outcome
    let intent: IntentEnum = updateData.funnelIntent || "UNKNOWN";
    if (nextStep === "selfSignup") intent = "SELF_SERVE";
    else if (nextStep === "demoBookingP0" || nextStep === "demoBookingP1") intent = "INTRO";

    // Build response
    const response: LeadUpdatedDto = {
      nextFunnelStep: nextStep,
      waitlistReason,
      intent,
      totalSteps: progress.totalSteps,
      stepNumber: progress.stepNumber,
    };

    // Add self-signup product if routing to self-signup
    if (nextStep === "selfSignup") {
      response.selfSignupProduct = determineSelfSignupProduct(leadData);
    }

    console.log("Response:", response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error in lead-routing function:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
