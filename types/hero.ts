// Hero Types
export interface Hero {
  _id: string;
  title1: string;
  title2: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
  links: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  showOnHome: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroData {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  primaryButton: {
    text: string;
    url: string;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryButton?: {
    text: string;
    url: string;
    variant?: "primary" | "secondary" | "outline";
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroFormData {
  title: string;
  subtitle?: string;
  description: string;
  primaryButton: {
    text: string;
    url: string;
    variant?: "primary" | "secondary" | "outline";
  };
  secondaryButton?: {
    text: string;
    url: string;
    variant?: "primary" | "secondary" | "outline";
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  isActive: boolean;
}

// Hero Button Variants
export type ButtonVariant = "primary" | "secondary" | "outline";

// Hero Import/Export Types
export interface HeroImportData {
  hero: Hero;
  metadata: {
    version: string;
    exportedAt: string;
  };
}

// Hero Error Types
export interface HeroError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type HeroErrorType =
  | "HERO_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UPLOAD_ERROR"
  | "DATABASE_ERROR";

// Utility Types
export type HeroWithoutId = Omit<Hero, "_id" | "createdAt" | "updatedAt">;
export type ActiveHero = Hero & { isActive: true };
