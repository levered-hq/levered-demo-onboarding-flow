// Funnel step configuration
export const STEP_ORDER = [
  "employees",
  "registration-country",
  "corporate-form",
  "pick-solution",
  "card-spend",
  "cards_need",
  "is-credit-required",
  "number-of-invoices",
  "erp",
];

// Step options configuration
export const STEP_OPTIONS: Record<string, Array<{ value: string; label: string; description?: string }>> = {
  employees: [
    { value: "sole-trader", label: "I'm a sole trader" },
    { value: "1-5", label: "1 - 5 employees" },
    { value: "6-10", label: "6 - 10 employees" },
    { value: "11-25", label: "11 - 25 employees" },
    { value: "26-100", label: "26 - 100 employees" },
    { value: "101-500", label: "101 - 500 employees" },
    { value: "500+", label: "More than 500 employees" },
  ],
  "registration-country": [
    { value: "DE", label: "Germany" },
    { value: "NL", label: "Netherlands" },
    { value: "GB", label: "United Kingdom" },
    { value: "AT", label: "Austria" },
    { value: "BE", label: "Belgium" },
    { value: "FR", label: "France" },
    { value: "IE", label: "Ireland" },
    { value: "ES", label: "Spain" },
  ],
  "corporate-form": [
    { value: "GmbH", label: "GmbH" },
    { value: "UG", label: "UG" },
    { value: "AG", label: "AG" },
    { value: "KG", label: "KG" },
  ],
  "pick-solution": [
    {
      value: "quick-access",
      label: "Quick access to cards",
      description: "Issue cards to teams quickly and easily.",
    },
    {
      value: "spend-control",
      label: "Spend control",
      description: "Control team spend with limits and real-time spend oversight.",
    },
    {
      value: "automate-finance",
      label: "Automate finance workflows",
      description: "Streamline approvals, receipt collection, and accounting.",
    },
  ],
  "card-spend": [
    { value: "<10k", label: "Less than €10k / month" },
    { value: "10-50k", label: "€10k - 50k / month" },
    { value: "50-100k", label: "€50k - 100k / month" },
    { value: "100k+", label: "More than €100k / month" },
  ],
  cards_need: [
    { value: "not-important", label: "Not important", description: "Prefunding cards is fine for now." },
    {
      value: "nice-to-have",
      label: "Nice to have",
      description: "A line of credit to fund cards helps, but is not essential.",
    },
    {
      value: "essential",
      label: "Essential*",
      description: "We will only use Moss if a line of credit is available.",
    },
  ],
  "is-credit-required": [
    { value: "not-important", label: "Not important", description: "Prefunding cards is fine for now." },
    {
      value: "nice-to-have",
      label: "Nice to have",
      description: "A line of credit to fund cards helps, but is not essential.",
    },
    {
      value: "essential",
      label: "Essential*",
      description: "We will only use Moss if a line of credit is available.",
    },
  ],
  "number-of-invoices": [
    { value: "<20", label: "Less than 20 invoices" },
    { value: "20-100", label: "20 - 100 invoices" },
    { value: "101-200", label: "101 - 200 invoices" },
    { value: "201-500", label: "201 - 500 invoices" },
    { value: "500+", label: "More than 500 invoices" },
  ],
  erp: [
    { value: "datev-online", label: "DATEV Unternehmen Online" },
    { value: "datev-rechnungswesen", label: "DATEV Rechnungswesen" },
    { value: "dynamics-365", label: "Microsoft Dynamics 365 Business Central" },
    { value: "netsuite", label: "Oracle NetSuite" },
  ],
};

// Step titles
export const STEP_TITLES: Record<string, string> = {
  employees: "How many employees does your company have?",
  "registration-country": "Where's the business registered?",
  "corporate-form": "What's the company's legal form?",
  "pick-solution": "What are you looking to achieve with corporate cards?",
  "card-spend": "What's your average monthly card spend?",
  cards_need: "What are you looking to achieve with corporate cards?",
  "is-credit-required": "How important is a line of credit for you?",
  "number-of-invoices": "How many invoices do you process every month?",
  erp: "Which accounting or ERP system does your company use?",
};

export const STEP_SUBTITLES: Record<string, string> = {
  "pick-solution": "Select the most important one.",
};

// Routing logic - determines next step or outcome based on answers
export function getNextRoute(
  currentStep: string,
  answer: string,
  allAnswers: Record<string, string>
): { type: "step" | "outcome"; slug: string } {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  // Simple logic - for now, just go to next step or final outcome
  if (currentIndex < STEP_ORDER.length - 1) {
    return { type: "step", slug: STEP_ORDER[currentIndex + 1] };
  }

  // Determine outcome based on answers
  // This is simplified - real logic would be more complex
  const employees = allAnswers.employees;
  const creditNeed = allAnswers["is-credit-required"];

  if (employees === "sole-trader" || employees === "1-5") {
    return { type: "outcome", slug: "self-onboarding" };
  } else if (creditNeed === "essential") {
    return { type: "outcome", slug: "book-demo-p0" };
  } else if (creditNeed === "nice-to-have") {
    return { type: "outcome", slug: "book-demo-p1" };
  } else {
    return { type: "outcome", slug: "book-demo-p2" };
  }
}

/**
 * Calculate progress - uses API data when available, falls back to hardcoded logic
 */
export function calculateProgress(currentStep: string, apiStepNumber?: number, apiTotalSteps?: number): number {
  // Use API-provided progress if available
  if (apiStepNumber !== undefined && apiTotalSteps !== undefined && apiTotalSteps > 0) {
    return Math.round((apiStepNumber / apiTotalSteps) * 100);
  }
  
  // Fallback to hardcoded logic
  const index = STEP_ORDER.indexOf(currentStep);
  if (index === -1) return 0;
  // +2 because we have email step before and outcome after
  return ((index + 2) / (STEP_ORDER.length + 2)) * 100;
}
