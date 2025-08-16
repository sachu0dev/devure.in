// Asset Types
export interface Asset {
  _id: string;
  name: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  tags: string[];
  category?: string;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetData {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  tags: string[];
  category?: string;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetFormData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  tags: string[];
  category?: string;
  isActive: boolean;
  uploadedBy?: string;
}

export interface AssetUploadResponse {
  success: boolean;
  data: Asset;
  message: string;
}

export interface AssetListResponse {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AssetFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  mimeType?: string;
  tags?: string[];
  status?: "all" | "active" | "inactive";
}

export interface AssetSearchOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tags?: string[];
}

export interface AssetCategory {
  name: string;
  postCount: number;
}

export interface AssetTag {
  name: string;
  postCount: number;
}

// Asset Import/Export Types
export interface AssetImportData {
  assets: Asset[];
  categories: AssetCategory[];
  tags: AssetTag[];
  metadata: {
    version: string;
    exportedAt: string;
  };
}

// Asset Error Types
export interface AssetError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type AssetErrorType =
  | "ASSET_NOT_FOUND"
  | "UPLOAD_ERROR"
  | "INVALID_FILE_TYPE"
  | "FILE_TOO_LARGE"
  | "STORAGE_ERROR"
  | "VALIDATION_ERROR"
  | "DATABASE_ERROR";

// Utility Types
export type AssetWithoutId = Omit<Asset, "_id" | "createdAt" | "updatedAt">;
export type ActiveAsset = Asset & { isActive: true };
export type ImageAsset = Asset & { mimeType: string };
export type VideoAsset = Asset & { mimeType: string };
export type DocumentAsset = Asset & { mimeType: string };
