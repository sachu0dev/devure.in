// Service Types
export interface Service {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceData {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image: string;
  icon?: string;
  features: string[];
  technologies: string[];
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  name: string;
  postCount: number;
}

export interface ServiceTag {
  name: string;
  postCount: number;
}

export interface ServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "all" | "active" | "inactive";
}

export interface ServiceFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  icon?: string;
  features: string[];
  technologies: string[];
  category: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ServicesHeader {
  _id: string;
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesHeaderData {
  _id: string;
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Service Import/Export Types
export interface ServiceImportData {
  services: Service[];
  categories: ServiceCategory[];
  tags: ServiceTag[];
  metadata: {
    version: string;
    exportedAt: string;
  };
}

// Service Error Types
export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type ServiceErrorType =
  | "SERVICE_NOT_FOUND"
  | "INVALID_SLUG"
  | "DUPLICATE_SLUG"
  | "VALIDATION_ERROR"
  | "UPLOAD_ERROR"
  | "DATABASE_ERROR";

// Utility Types
export type ServiceWithoutContent = Omit<Service, "content">;
export type ServiceWithExcerpt = Service & { excerpt: string };
export type FeaturedService = Service & { isFeatured: true };
export type ActiveService = Service & { isActive: true };
