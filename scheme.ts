export type SupportedLanguage = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export interface SchemeBenefit {
  title: string;
  description: string;
  amountOrValue?: string;
  category?: string;
}

export interface DocumentItem {
  documentName: string;
  purpose: string;
  isMandatory: boolean;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface CustomQuestion {
  id: string;
  question: string;
  type: 'select' | 'boolean' | 'number' | 'text';
  options?: string[];
  helpText?: string;
}

export interface SchemeAnalysis {
  id: string;
  schemeName: string;
  nativeSchemeName?: string;
  department: string;
  governmentLevel: 'Central Government' | 'State Government' | 'Joint Central & State';
  stateOrRegion?: string;
  mainPurpose: string;
  simpleExplanation: string;
  targetBeneficiaries: string[];
  eligibilityCriteria: {
    ageRequirement: string;
    incomeRequirement: string;
    occupationRequirement: string;
    stateApplicability: string;
    genderRequirement?: string;
    otherConditions: string[];
  };
  benefits: SchemeBenefit[];
  requiredDocuments: DocumentItem[];
  applicationProcess: ApplicationStep[];
  officialSource: {
    isOfficialSourceDetected: boolean;
    portalName?: string;
    websiteUrl?: string;
    helpline?: string;
    sourceNotes?: string;
  };
  importantConditions: string[];
  warningsAndCaveats: string[];
  dynamicQuestions: CustomQuestion[];
  detectedLanguage: string;
  confidenceScore?: number;
}

export interface UserEligibilityProfile {
  age: string;
  state: string;
  occupation: string;
  annualIncome: string;
  category: string;
  gender: string;
  customAnswers: Record<string, string | boolean | number>;
}

export interface CriteriaEvaluationItem {
  criterion: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
}

export interface EligibilityResult {
  status: 'eligible' | 'possibly_eligible' | 'not_eligible';
  verdictTitle: string;
  verdictSummary: string;
  criteriaEvaluations: CriteriaEvaluationItem[];
  keyHighlights: string[];
  missingOrUnverified: string[];
  recommendedSteps: string[];
  officialDisclaimer: string;
}

export interface PresetScheme {
  id: string;
  title: string;
  tagline: string;
  category: string;
  badge: string;
  thumbnail: string;
  mockFileName: string;
  fileBase64: string;
  mimeType: string;
  precomputedData: SchemeAnalysis;
}
