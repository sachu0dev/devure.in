// Admin Types
export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin" | "editor";
  isActive: boolean;
  lastLogin?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token?: string;
  user: AdminUser;
  message: string;
}

export interface AdminStats {
  totalBlogs: number;
  totalProjects: number;
  totalServices: number;
  totalAssets: number;
  totalUsers: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  _id: string;
  action: string;
  entity: string;
  entityId: string;
  userId: string;
  username: string;
  timestamp: string;
  details?: unknown;
}

export interface AdminDashboardData {
  stats: AdminStats;
  recentBlogs: BlogSummary[];
  recentProjects: ProjectSummary[];
  recentServices: ServiceSummary[];
  systemHealth: SystemHealth;
}

export interface BlogSummary {
  _id: string;
  title: string;
  slug: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSummary {
  _id: string;
  title: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface ServiceSummary {
  _id: string;
  title: string;
  slug: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  database: "healthy" | "warning" | "error";
  storage: "healthy" | "warning" | "error";
  api: "healthy" | "warning" | "error";
  lastChecked: string;
}

export interface AdminPermissions {
  blogs: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    publish: boolean;
  };
  projects: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    feature: boolean;
  };
  services: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    feature: boolean;
  };
  assets: {
    upload: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    manage: boolean;
  };
  users: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    manage: boolean;
  };
  settings: {
    read: boolean;
    update: boolean;
  };
}

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
  analytics: {
    googleAnalytics?: string;
    googleTagManager?: string;
  };
  seo: {
    defaultMetaTitle: string;
    defaultMetaDescription: string;
    defaultKeywords: string[];
  };
}

// Admin Error Types
export interface AdminError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type AdminErrorType =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "USER_NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "SESSION_EXPIRED"
  | "INSUFFICIENT_PERMISSIONS"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR";

// Utility Types
export type AdminUserWithoutPassword = Omit<AdminUser, "password">;
export type ActiveAdminUser = AdminUser & { isActive: true };
export type SuperAdmin = AdminUser & { role: "super_admin" };
