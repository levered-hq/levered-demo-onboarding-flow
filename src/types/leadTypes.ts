// Type definitions matching the API contract

export type BackendStepEnum =
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

export type IntentEnum = "SELF_SERVE" | "INTRO" | "PRICING" | "UNKNOWN" | "NEUTRAL";

export type EmployeesEnum = "1" | "1 - 10" | "11 - 25" | "26 - 50" | "51 - 150" | "151 - 300" | ">300";

export type ProductInterestEnum = "corporate-cards" | "accounts-payable" | "employee-reimbursement" | "I don't know";

export type CardSpendEnum =
  | "<1k"
  | "1k - 5k"
  | "5k - 10k"
  | "<10k"
  | "10k<"
  | "10k - 15k"
  | "15k - 30k"
  | "30k - 50k"
  | "50k - 200k"
  | ">200k";

export type CreditRequiredEnum = "Yes" | "No";

export type InvoicesEnum = "<20" | "20 - 100" | "101 - 200" | "201 - 500" | ">500";

export type EngagementStageEnum = "HIGH_INTENT" | "CONSIDERATION_STAGE" | "LOW_INTENT_TESTER";

export type SelfSignupProductEnum = "ACCOUNTS_PAYABLE" | "CORPORATE_CARDS" | "EMPLOYEE_REIMBURSEMENTS";

export interface LeadUpdateDto {
  intent?: IntentEnum;
  numberOfEmployees?: EmployeesEnum;
  registrationCountry?: string; // ISO 3166-1 alpha-2
  legalForm?: string;
  productInterest?: ProductInterestEnum[];
  cardSpend?: CardSpendEnum;
  isCreditRequired?: CreditRequiredEnum;
  numberOfInvoices?: InvoicesEnum;
  erpSystem?: string;
  funnelIntent?: IntentEnum;
  engagementStage?: EngagementStageEnum;
}

export interface LeadUpdatedDto {
  nextFunnelStep: BackendStepEnum;
  waitlistReason: BackendStepEnum | null;
  selfSignupProduct?: SelfSignupProductEnum;
  intent: IntentEnum;
  totalSteps: number;
  stepNumber: number;
}
