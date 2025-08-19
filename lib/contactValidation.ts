import { ContactFormData } from "@/types/contact";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface SanitizedContactData
  extends Omit<ContactFormData, "phone" | "website"> {
  phone?: string;
  website?: string;
}

/**
 * Server-side validation for contact form data
 */
export function validateContactForm(
  data: Partial<ContactFormData>
): ValidationResult {
  const errors: Record<string, string> = {};

  // Required fields
  if (!data.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = "Full name cannot exceed 100 characters";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.message?.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length > 2000) {
    errors.message = "Message cannot exceed 2000 characters";
  }

  // Optional fields with validation
  if (data.phone?.trim()) {
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, "");
    if (!/^[\+]?[1-9][\d]{0,15}$/.test(cleanPhone)) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  if (data.website?.trim()) {
    try {
      new URL(data.website);
    } catch {
      errors.website = "Please enter a valid website URL";
    }
  }

  // Enum validations
  const validProjectTypes = [
    "new_project",
    "redesign",
    "maintenance",
    "consultation",
  ];
  if (!data.projectType || !validProjectTypes.includes(data.projectType)) {
    errors.projectType = "Please select a valid project type";
  }

  const validServiceTypes = [
    "web_app",
    "landing_page",
    "ecommerce",
    "mobile_app",
    "ui_ux",
    "api_integration",
    "seo",
  ];
  if (!data.serviceType || !validServiceTypes.includes(data.serviceType)) {
    errors.serviceType = "Please select a valid service type";
  }

  // Budget and timeline length validation
  if (data.budget && data.budget.length > 50) {
    errors.budget = "Budget cannot exceed 50 characters";
  }

  if (data.timeline && data.timeline.length > 50) {
    errors.timeline = "Timeline cannot exceed 50 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactData(
  data: Partial<ContactFormData>
): SanitizedContactData {
  return {
    fullName: data.fullName?.trim() || "",
    email: data.email?.trim().toLowerCase() || "",
    phone: data.phone?.trim() || undefined,
    website: data.website?.trim() || undefined,
    projectType: data.projectType || "new_project",
    serviceType: data.serviceType || "web_app",
    budget: data.budget?.trim() || "",
    timeline: data.timeline?.trim() || "",
    message: data.message?.trim() || "",
    requestedCall: Boolean(data.requestedCall),
  };
}

/**
 * Validate reCAPTCHA token
 */
export async function validateRecaptcha(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: "POST" }
    );

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA validation error:", error);
    return false;
  }
}

/**
 * Check for honeypot field (spam detection)
 */
export function checkHoneypot(honeypotValue: string): boolean {
  // If honeypot field has any value, it's likely spam
  return !honeypotValue || honeypotValue.trim() === "";
}
