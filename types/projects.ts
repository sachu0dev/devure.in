// Project Types
export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  images: string[];
  tags: string[];
  category: string;
  client?: string;
  duration?: string;
  technologies: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  images: string[];
  tags: string[];
  category: string;
  client?: string;
  duration?: string;
  technologies: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  liveUrl?: string;
  githubUrl?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCategory {
  name: string;
  postCount: number;
}

export interface ProjectTag {
  name: string;
  postCount: number;
}

export interface ProjectsResponse {
  projects: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  tags: string[];
  category: string;
  client?: string;
  duration?: string;
  technologies: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  liveUrl?: string;
  githubUrl?: string;
}

// Project Import/Export Types
export interface ProjectImportData {
  projects: Project[];
  categories: ProjectCategory[];
  tags: ProjectTag[];
  metadata: {
    version: string;
    exportedAt: string;
  };
}

// Project Error Types
export interface ProjectError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type ProjectErrorType =
  | "PROJECT_NOT_FOUND"
  | "INVALID_SLUG"
  | "DUPLICATE_SLUG"
  | "VALIDATION_ERROR"
  | "UPLOAD_ERROR"
  | "DATABASE_ERROR";

// Utility Types
export type ProjectWithoutContent = Omit<Project, "content">;
export type ProjectWithExcerpt = Project & { excerpt: string };
export type FeaturedProject = Project & { isFeatured: true };
export type ActiveProject = Project & { isActive: true };
