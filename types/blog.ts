// Blog Content Source Types
export type ContentSource = "local" | "s3";

// Author Information
export interface Author {
  name: string;
  profileUrl: string;
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

// Blog Post Frontmatter
export interface BlogFrontmatter {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  category: string;
  date: string;
  coverImage: string;
  ogImage: string;
  author: Author;
  readTime?: string;
  featured?: boolean;
  draft?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  seo?: {
    keywords?: string[];
    canonical?: string;
    noindex?: boolean;
  };
}

// Blog Post Content
export interface BlogContent {
  frontmatter: BlogFrontmatter;
  content: string;
  excerpt?: string;
  wordCount?: number;
}

// Local Content Blog Post
export interface LocalBlogPost extends BlogContent {
  source: "local";
  filePath: string;
  fileName: string;
}

// S3 Content Blog Post
export interface S3BlogPost extends BlogContent {
  source: "s3";
  s3Key: string;
  s3Bucket: string;
  s3Region?: string;
  lastModified?: string;
  etag?: string;
}

// Union type for all blog post types
export type BlogPost = LocalBlogPost | S3BlogPost;

// Blog Post Summary (for listings)
export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  coverImage: string;
  author: Author;
  readTime: string;
  featured: boolean;
  source: ContentSource;
  excerpt?: string;
  wordCount?: number;
}

// Blog Category
export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  featured?: boolean;
}

// Blog Tag
export interface BlogTag {
  name: string;
  slug: string;
  postCount: number;
}

// Blog Search and Filter Options
export interface BlogSearchOptions {
  query?: string;
  category?: string;
  tags?: string[];
  author?: string;
  featured?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: "date" | "title" | "readTime" | "wordCount";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

// Blog Search Results
export interface BlogSearchResults {
  posts: BlogPostSummary[];
  total: number;
  hasMore: boolean;
  categories: BlogCategory[];
  tags: BlogTag[];
}

// S3 Configuration
export interface S3Config {
  bucket: string;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  prefix?: string;
  endpoint?: string;
}

// Content Source Configuration
export interface ContentConfig {
  local?: {
    contentDir: string;
    extensions: string[];
  };
  s3?: S3Config;
  defaultSource: ContentSource;
}

// Blog API Response Types
export interface BlogListResponse {
  posts: BlogPostSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    categories: BlogCategory[];
    tags: BlogTag[];
    authors: Author[];
  };
}

export interface BlogDetailResponse {
  post: BlogPost;
  relatedPosts: BlogPostSummary[];
  nextPost?: BlogPostSummary;
  prevPost?: BlogPostSummary;
}

// Blog Metadata for SEO
export interface BlogMetadata {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  publishedTime: string;
  modifiedTime?: string;
  image: string;
  url: string;
  canonical?: string;
  noindex?: boolean;
}

// Blog Statistics
export interface BlogStats {
  totalPosts: number;
  totalCategories: number;
  totalTags: number;
  totalAuthors: number;
  totalWords: number;
  averageReadTime: number;
  featuredPosts: number;
  draftPosts: number;
}

// Type Guards
export const isLocalBlogPost = (post: BlogPost): post is LocalBlogPost => {
  return post.source === "local";
};

export const isS3BlogPost = (post: BlogPost): post is S3BlogPost => {
  return post.source === "s3";
};

// Utility Types
export type BlogPostWithoutContent = Omit<BlogPost, "content">;
export type BlogPostWithExcerpt = BlogPost & { excerpt: string };
export type FeaturedBlogPost = BlogPost & { featured: true };

// Blog Import/Export Types
export interface BlogImportData {
  posts: BlogPost[];
  categories: BlogCategory[];
  tags: BlogTag[];
  authors: Author[];
  metadata: {
    version: string;
    exportedAt: string;
    source: ContentSource;
  };
}

// Blog Cache Types
export interface BlogCache {
  posts: Map<string, BlogPost>;
  summaries: Map<string, BlogPostSummary>;
  categories: Map<string, BlogCategory>;
  tags: Map<string, BlogTag>;
  lastUpdated: Date;
}

// Blog Error Types
export interface BlogError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export type BlogErrorType =
  | "POST_NOT_FOUND"
  | "INVALID_FRONTMATTER"
  | "S3_ACCESS_DENIED"
  | "S3_FILE_NOT_FOUND"
  | "LOCAL_FILE_NOT_FOUND"
  | "PARSE_ERROR"
  | "VALIDATION_ERROR";

export interface FooterContent {
  _id: string;
  title: string;
  description: string;
  quickLinks: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  servicesLinks: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
    order: number;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
