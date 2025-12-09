// Form variant types
export type FormVariant = "demo" | "paid";
export type PaidTier = "basic" | "pro" | "enterprise";

// Step identifiers
export type StepId = "account" | "verify" | "business" | "branding" | "payment";

// Step configuration
export interface FormStep {
  id: StepId;
  title: string;
  icon?: string;
}

// Teacher type options
export type TeacherType = "individual" | "institution";

// Teaching method options
export type TeachingMethod = "online" | "offline" | "hybrid";

// Payment method options
export type PaymentMethod = "e-wallet" | "bank-account";

// Payment period options
export type PaymentPeriod = "monthly" | "yearly";

// ==========================================
// Step 1: Account Information
// ==========================================
export interface AccountInfoData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  language: string;
  timezone: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptSms: boolean;
  acceptWhatsapp: boolean;
}

// ==========================================
// Step 2: Email Verification
// ==========================================
export interface EmailVerifyData {
  otp: string;
}

// ==========================================
// Step 3: Business Details
// ==========================================
export interface BusinessInfoData {
  teacherType: TeacherType;
  brandName: string;
  legalName: string;
  subjects: string[];
  gradeLevels: string[];
  teachingMethod: TeachingMethod;
  expectedStudents: number;
  country: string;
  governorate: string;
  city: string;
  address: string;
  howDidYouHear?: string;
  additionalNotes?: string;
  discountCode?: string;
}

// ==========================================
// Step 4: Website & Branding
// ==========================================
export interface BrandingData {
  websiteName: string;
  selectedTemplate: string;
  logoFile?: File | null;
  faviconFile?: File | null;
  coverFile?: File | null;
}

// ==========================================
// Step 5: Payment (Paid only)
// ==========================================
export interface PaymentData {
  paymentPeriod: PaymentPeriod;
  paymentMethod: PaymentMethod;
  paymentDetails: string;
}

// ==========================================
// Combined Form Data
// ==========================================
export interface SubscribeFormData {
  account: AccountInfoData;
  verify: EmailVerifyData;
  business: BusinessInfoData;
  branding: BrandingData;
  payment?: PaymentData;
}

// ==========================================
// Sidebar Configuration
// ==========================================
export interface SidebarConfig {
  variant: FormVariant;
  tier?: PaidTier;
  seatCount?: number;
  features: string[];
}

// ==========================================
// Template Option
// ==========================================
export interface TemplateOption {
  id: string;
  name: string;
  previewImage: string;
}

// ==========================================
// Select Options
// ==========================================
export interface SelectOption {
  value: string;
  label: string;
}

// Countries, Governorates, Cities data structure
export interface LocationData {
  countries: SelectOption[];
  governorates: Record<string, SelectOption[]>;
  cities: Record<string, SelectOption[]>;
}
