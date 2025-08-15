import api from "./axios";
import {
  BlogPost,
  BlogPostSummary,
  BlogSearchOptions,
  BlogSearchResults,
  BlogCategory,
  BlogTag,
  BlogStats,
  BlogFrontmatter,
} from "@/types/blog";

// Hero types
export interface HeroContent {
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

// Asset types
export interface Asset {
  _id: string;
  name: string;
  url: string;
  s3Key: string;
  s3Bucket: string;
  s3Region?: string;
  alt: string;
  description?: string;
  tags: string[];
  category: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isPublic: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetSearchOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string[];
}

// Service types
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

export interface ServicesHeader {
  _id: string;
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    blogs: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

interface AssetPaginatedResponse {
  data: {
    assets: Asset[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// =============================================================================
// PUBLIC BLOG APIs
// =============================================================================

/**
 * Get all published blogs with search and filtering
 */
export const getBlogs = async (
  options: BlogSearchOptions = {}
): Promise<BlogSearchResults> => {
  const params = new URLSearchParams();

  if (options.query) params.append("q", options.query);
  if (options.category) params.append("category", options.category);
  if (options.tags?.length) params.append("tags", options.tags.join(","));
  if (options.author) params.append("author", options.author);
  if (options.featured !== undefined)
    params.append("featured", options.featured.toString());
  if (options.sortBy) params.append("sortBy", options.sortBy);
  if (options.sortOrder) params.append("sortOrder", options.sortOrder);
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.offset) params.append("offset", options.offset.toString());

  const response = await api.get<ApiResponse<BlogSearchResults>>(
    `/blogs?${params.toString()}`
  );
  return response.data.data;
};

/**
 * Get a specific blog by slug
 */
export const getBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await api.get<ApiResponse<{ blog: BlogPost }>>(
    `/blogs/${slug}`
  );
  return response.data.data.blog;
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<BlogCategory[]> => {
  const response = await api.get<ApiResponse<{ categories: BlogCategory[] }>>(
    "/blogs/categories"
  );
  return response.data.data.categories;
};

/**
 * Get all tags
 */
export const getTags = async (): Promise<BlogTag[]> => {
  const response = await api.get<ApiResponse<{ tags: BlogTag[] }>>(
    "/blogs/tags"
  );
  return response.data.data.tags;
};

// =============================================================================
// ADMIN BLOG APIs
// =============================================================================

/**
 * Get all blogs for admin (including drafts)
 */
export const getAdminBlogs = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "published" | "draft";
  } = {}
): Promise<PaginatedResponse<BlogPostSummary>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);

  const response = await api.get<PaginatedResponse<BlogPostSummary>>(
    `/admin/blogs?${queryParams.toString()}`
  );
  return response.data;
};

/**
 * Get a specific blog for admin
 */
export const getAdminBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const response = await api.get<ApiResponse<{ blog: BlogPost }>>(
    `/admin/blogs/${slug}`
  );
  return response.data.data.blog;
};

/**
 * Create a new blog
 */
export const createBlog = async (data: {
  frontmatter: BlogFrontmatter;
  content: string;
  excerpt?: string;
}): Promise<BlogPostSummary> => {
  const response = await api.post<
    ApiResponse<{ blog: BlogPostSummary; message: string }>
  >("/admin/blogs", data);
  return response.data.data.blog;
};

/**
 * Update an existing blog
 */
export const updateBlog = async (
  slug: string,
  data: {
    frontmatter: Partial<BlogFrontmatter>;
    content?: string;
    excerpt?: string;
  }
): Promise<BlogPostSummary> => {
  const response = await api.put<
    ApiResponse<{ blog: BlogPostSummary; message: string }>
  >(`/admin/blogs/${slug}`, data);
  return response.data.data.blog;
};

/**
 * Delete a blog
 */
export const deleteBlog = async (slug: string): Promise<void> => {
  await api.delete<ApiResponse<{ message: string }>>(`/admin/blogs/${slug}`);
};

/**
 * Toggle blog draft status
 */
export const toggleBlogDraftStatus = async (
  slug: string
): Promise<BlogPostSummary> => {
  const response = await api.patch<
    ApiResponse<{ blog: BlogPostSummary; message: string }>
  >(`/admin/blogs/${slug}`, {
    action: "toggleDraft",
  });
  return response.data.data.blog;
};

/**
 * Toggle blog featured status
 */
export const toggleBlogFeaturedStatus = async (
  slug: string
): Promise<BlogPostSummary> => {
  const response = await api.patch<
    ApiResponse<{ blog: BlogPostSummary; message: string }>
  >(`/admin/blogs/${slug}`, {
    action: "toggleFeatured",
  });
  return response.data.data.blog;
};

/**
 * Get blog statistics
 */
export const getBlogStats = async (): Promise<BlogStats> => {
  const response = await api.get<ApiResponse<{ stats: BlogStats }>>(
    "/admin/stats"
  );
  return response.data.data.stats;
};

// =============================================================================
// FILE UPLOAD APIs
// =============================================================================

/**
 * Upload image to S3
 */
export const uploadImage = async (
  formData: FormData
): Promise<{
  url: string;
  key: string;
  size: number;
  type: string;
  assetId: string;
  asset: Asset;
}> => {
  const response = await api.post<
    ApiResponse<{
      url: string;
      key: string;
      size: number;
      type: string;
      assetId: string;
      asset: Asset;
    }>
  >("/admin/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// =============================================================================
// HERO APIs
// =============================================================================

/**
 * Get hero content for home page
 */
export const getHeroContent = async (): Promise<HeroContent> => {
  const response = await api.get<ApiResponse<HeroContent>>("/hero");
  return response.data.data;
};

/**
 * Get hero content for admin
 */
export const getAdminHeroContent = async (): Promise<HeroContent> => {
  const response = await api.get<ApiResponse<HeroContent>>("/admin/hero");
  return response.data.data;
};

/**
 * Update hero content
 */
export const updateHeroContent = async (
  data: Partial<HeroContent>
): Promise<HeroContent> => {
  const response = await api.put<ApiResponse<HeroContent>>("/admin/hero", data);
  return response.data.data;
};

// =============================================================================
// ASSET APIs
// =============================================================================

/**
 * Get assets with pagination and search
 */
export const getAssets = async (
  options: AssetSearchOptions = {}
): Promise<AssetPaginatedResponse["data"]> => {
  const params = new URLSearchParams();

  if (options.page) params.append("page", options.page.toString());
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.search) params.append("search", options.search);
  if (options.category) params.append("category", options.category);
  if (options.tags?.length) params.append("tags", options.tags.join(","));

  const response = await api.get<AssetPaginatedResponse>(
    `/admin/assets?${params.toString()}`
  );
  return response.data.data;
};

/**
 * Create new asset
 */
export const createAsset = async (data: Partial<Asset>): Promise<Asset> => {
  const response = await api.post<ApiResponse<Asset>>("/admin/assets", data);
  return response.data.data;
};

/**
 * Update asset
 */
export const updateAsset = async (
  id: string,
  data: Partial<Asset>
): Promise<Asset> => {
  const response = await api.put<ApiResponse<Asset>>(
    `/admin/assets/${id}`,
    data
  );
  return response.data.data;
};

/**
 * Delete asset
 */
export const deleteAsset = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<{ message: string }>>(`/admin/assets/${id}`);
};

/**
 * Bulk delete assets
 */
export const bulkDeleteAssets = async (
  assetIds: string[]
): Promise<{
  message: string;
  results: {
    total: number;
    deleted: number;
    s3Deleted: number;
    errors: string[];
  };
}> => {
  const response = await api.post<
    ApiResponse<{
      message: string;
      results: {
        total: number;
        deleted: number;
        s3Deleted: number;
        errors: string[];
      };
    }>
  >("/admin/assets/bulk-delete", { assetIds });
  return response.data.data;
};

// =============================================================================
// SERVICE APIs
// =============================================================================

/**
 * Get all active services
 */
export const getServices = async (): Promise<Service[]> => {
  const response = await api.get<ApiResponse<Service[]>>("/services");
  return response.data.data;
};

/**
 * Get services header
 */
export const getServicesHeader = async (): Promise<ServicesHeader> => {
  const response = await api.get<ApiResponse<ServicesHeader>>(
    "/services-header"
  );
  return response.data.data;
};

/**
 * Get services header for admin (with fallback creation)
 */
export const getAdminServicesHeader = async (): Promise<ServicesHeader> => {
  const response = await api.get<ApiResponse<ServicesHeader>>(
    "/admin/services-header"
  );
  return response.data.data;
};

/**
 * Get all services for admin (including inactive)
 */
export const getAdminServices = async (
  params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "all" | "active" | "inactive";
  } = {}
): Promise<{
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);

  const response = await api.get<{
    data: {
      services: Service[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    };
  }>(`/admin/services?${queryParams.toString()}`);
  return response.data.data;
};

/**
 * Get a specific service for admin
 */
export const getAdminServiceBySlug = async (slug: string): Promise<Service> => {
  const response = await api.get<ApiResponse<Service>>(
    `/admin/services/${slug}`
  );
  return response.data.data;
};

/**
 * Create a new service
 */
export const createService = async (
  data: Partial<Service>
): Promise<Service> => {
  const response = await api.post<ApiResponse<Service>>(
    "/admin/services",
    data
  );
  return response.data.data;
};

/**
 * Update an existing service
 */
export const updateService = async (
  slug: string,
  data: Partial<Service>
): Promise<Service> => {
  const response = await api.put<ApiResponse<Service>>(
    `/admin/services/${slug}`,
    data
  );
  return response.data.data;
};

/**
 * Delete a service
 */
export const deleteService = async (slug: string): Promise<void> => {
  await api.delete<ApiResponse<{ message: string }>>(`/admin/services/${slug}`);
};

/**
 * Update services header
 */
export const updateServicesHeader = async (
  data: Partial<ServicesHeader>
): Promise<ServicesHeader> => {
  const response = await api.put<ApiResponse<ServicesHeader>>(
    "/admin/services-header",
    data
  );
  return response.data.data;
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Handle API errors
 */
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as {
      response?: { data?: { error?: string }; status?: number };
    };

    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }

    if (apiError.response?.status === 404) {
      return "Resource not found";
    }

    if (apiError.response?.status === 500) {
      return "Internal server error";
    }
  }

  if (error && typeof error === "object" && "code" in error) {
    const networkError = error as { code?: string; message?: string };
    if (networkError.code === "NETWORK_ERROR") {
      return "Network error. Please check your connection.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
};

/**
 * Check if response is successful
 */
export const isApiSuccess = (response: unknown): boolean => {
  const responseData = response as { data?: { success?: boolean } };
  return responseData?.data?.success === true;
};

/**
 * Extract data from API response
 */
export const extractApiData = <T>(response: unknown): T => {
  return (response as { data?: { data?: T } })?.data?.data as T;
};
