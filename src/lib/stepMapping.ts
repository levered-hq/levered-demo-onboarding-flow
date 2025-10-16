import { BackendStepEnum } from "@/types/leadTypes";

// Map frontend slugs to backend enum values
export const FRONTEND_TO_BACKEND_STEP_MAP: Record<string, BackendStepEnum> = {
  "email": "email",
  "employees": "numberOfEmployees",
  "registration-country": "registrationCountry",
  "micro-entity-turnover": "isMicroEntityTurnoverExceeded",
  "corporate-form": "legalForm",
  "pick-solution": "productInterests",
  "card-spend": "cardSpend",
  "card-spend-small": "cardSpendSmallSpender",
  "is-credit-required": "isCreditRequired",
  "number-of-invoices": "numberOfInvoices",
  "funnel-intent": "funnelIntent",
  "engagement-stage": "engagementStage",
  "erp": "erpSystem",
  "waitlist": "waitlist",
  "not-for-you": "notForYou",
  "book-demo-p0": "demoBookingP0",
  "book-demo-p1": "demoBookingP1",
  "book-demo-p2": "demoBookingP2",
  "self-onboarding": "selfSignup",
};

// Reverse mapping for converting API responses back to frontend routes
export const BACKEND_TO_FRONTEND_STEP_MAP: Record<BackendStepEnum, string> = Object.fromEntries(
  Object.entries(FRONTEND_TO_BACKEND_STEP_MAP).map(([key, value]) => [value, key])
) as Record<BackendStepEnum, string>;

// Outcome steps (final destinations)
const OUTCOME_STEPS = new Set<BackendStepEnum>([
  "waitlist",
  "notForYou",
  "demoBookingP0",
  "demoBookingP1",
  "demoBookingP2",
  "selfSignup",
]);

/**
 * Convert frontend step slug to backend enum value
 */
export function mapStepSlugToBackend(slug: string): BackendStepEnum {
  const mapped = FRONTEND_TO_BACKEND_STEP_MAP[slug];
  if (!mapped) {
    console.warn(`Unknown step slug: ${slug}, using as-is`);
    return slug as BackendStepEnum;
  }
  return mapped;
}

/**
 * Convert backend step enum to frontend slug
 */
export function mapStepSlugFromBackend(backendStep: BackendStepEnum): string {
  const mapped = BACKEND_TO_FRONTEND_STEP_MAP[backendStep];
  if (!mapped) {
    console.warn(`Unknown backend step: ${backendStep}, using as-is`);
    return backendStep;
  }
  return mapped;
}

/**
 * Check if a step is a final outcome (not a regular funnel step)
 */
export function isOutcomeStep(step: BackendStepEnum): boolean {
  return OUTCOME_STEPS.has(step);
}
