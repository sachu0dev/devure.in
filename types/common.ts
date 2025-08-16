// Common Types - Shared across the application

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: unknown) => boolean | string;
  };
}

export interface FormData {
  [key: string]: unknown;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormState<T> {
  data: T;
  errors: FormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  isActive?: boolean;
  isExternal?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
  isCurrent?: boolean;
}

// SEO Types
export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

// File Types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Status Types
export type Status = "idle" | "loading" | "success" | "error";

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Date Types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeRange {
  start: string;
  end: string;
}

// Filter Types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  name: string;
  options: FilterOption[];
  multiSelect?: boolean;
}

export interface AppliedFilters {
  [key: string]: string | string[];
}

// Sort Types
export interface SortOption {
  field: string;
  direction: "asc" | "desc";
  label: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Modal Types
export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: unknown;
}

// Toast/Notification Types
export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

// Validation Types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
