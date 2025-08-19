export type ContactProjectType =
  | "new_project"
  | "redesign"
  | "maintenance"
  | "consultation";

export type ContactServiceType =
  | "web_app"
  | "landing_page"
  | "ecommerce"
  | "mobile_app"
  | "ui_ux"
  | "api_integration"
  | "seo";

// Allow free-text for budget and timeline to support custom inputs
export type ContactBudgetRange = string;

export type ContactTimeline = string;

export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  website?: string;
  projectType: ContactProjectType;
  serviceType: ContactServiceType;
  budget: ContactBudgetRange;
  timeline: ContactTimeline;
  message: string;
  requestedCall?: boolean;
}
