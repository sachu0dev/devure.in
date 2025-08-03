/**
 * Environment Variables Configuration
 * Centralized access to environment variables with proper fallbacks
 */

export const env = {
  // Site Configuration
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://devure.in",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "Devure",
  SITE_DESCRIPTION:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Explore insights, tutorials, and deep dives into technology",

  // Admin Configuration
  ADMIN_USERNAME: process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin",
  ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "devure2024",
  ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@devure.in",

  // Image Configuration
  IMAGE_DOMAINS: (() => {
    const domains = ["placehold.co", "images.unsplash.com"];

    // Add S3 domain if bucket and region are configured
    if (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_S3_REGION) {
      domains.push(
        `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com`
      );
    }

    // Add custom domains from environment
    if (process.env.NEXT_PUBLIC_IMAGE_DOMAINS) {
      domains.push(...process.env.NEXT_PUBLIC_IMAGE_DOMAINS.split(","));
    }

    return domains;
  })(),
  PLACEHOLDER_IMAGE_URL:
    process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE_URL ||
    "https://placehold.co/500x700/618C70/FFFFFF/png",

  // AWS S3 Configuration
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
  AWS_S3_REGION: process.env.AWS_S3_REGION,
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,
  AWS_S3_BLOG_PREFIX: process.env.AWS_S3_BLOG_PREFIX || "blogs",
  AWS_S3_IMAGES_PREFIX: process.env.AWS_S3_IMAGES_PREFIX || "images",
  AWS_S3_MDX_PREFIX: process.env.AWS_S3_MDX_PREFIX || "mdx",

  // MongoDB Configuration
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/devure_blog",
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "devure_blog",
  MONGODB_MAX_POOL_SIZE: parseInt(process.env.MONGODB_MAX_POOL_SIZE || "10"),
  MONGODB_MIN_POOL_SIZE: parseInt(process.env.MONGODB_MIN_POOL_SIZE || "2"),
  MONGODB_MAX_IDLE_TIME_MS: parseInt(
    process.env.MONGODB_MAX_IDLE_TIME_MS || "30000"
  ),
  MONGODB_CONNECT_TIMEOUT_MS: parseInt(
    process.env.MONGODB_CONNECT_TIMEOUT_MS || "10000"
  ),
  MONGODB_SOCKET_TIMEOUT_MS: parseInt(
    process.env.MONGODB_SOCKET_TIMEOUT_MS || "45000"
  ),
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,

  // Authentication & Security
  JWT_SECRET: process.env.JWT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE || "86400"),

  // SEO & Analytics
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
  GOOGLE_SEARCH_CONSOLE_VERIFICATION:
    process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION,
  TWITTER_HANDLE: process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@devure",
  GITHUB_URL:
    process.env.NEXT_PUBLIC_GITHUB_URL ||
    "https://github.com/yourusername/devure",

  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@devure.in",

  // Content Management
  CONTENT_BLOGS_DIR: process.env.CONTENT_BLOGS_DIR || "content/blogs",
  CONTENT_AUTHORS_DIR: process.env.CONTENT_AUTHORS_DIR || "content/authors",
  CONTENT_CATEGORIES_DIR:
    process.env.CONTENT_CATEGORIES_DIR || "content/categories",

  // Development & Debugging
  DEBUG: process.env.DEBUG === "true",
  NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG === "true",
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),

  // Monitoring & Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Cache & Performance
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  CACHE_TTL: parseInt(process.env.CACHE_TTL || "3600"),
  CACHE_MAX_SIZE: parseInt(process.env.CACHE_MAX_SIZE || "100"),

  // Deployment
  VERCEL_URL: process.env.VERCEL_URL,
  BUILD_TIME: process.env.NEXT_PUBLIC_BUILD_TIME,
  VERSION: process.env.NEXT_PUBLIC_VERSION || "1.0.0",

  // Feature Flags
  ENABLE_COMMENTS: process.env.NEXT_PUBLIC_ENABLE_COMMENTS !== "false",
  ENABLE_SEARCH: process.env.NEXT_PUBLIC_ENABLE_SEARCH !== "false",
  ENABLE_NEWSLETTER: process.env.NEXT_PUBLIC_ENABLE_NEWSLETTER !== "false",
  ENABLE_SOCIAL_SHARING:
    process.env.NEXT_PUBLIC_ENABLE_SOCIAL_SHARING !== "false",
  ENABLE_ADMIN_PANEL: process.env.ENABLE_ADMIN_PANEL !== "false",
  ENABLE_BLOG_EDITOR: process.env.ENABLE_BLOG_EDITOR !== "false",
  ENABLE_IMAGE_UPLOAD: process.env.ENABLE_IMAGE_UPLOAD !== "false",

  // Third-party Integrations
  DISQUS_SHORTNAME: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME,
  MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Security Headers
  CSP_NONCE: process.env.NEXT_PUBLIC_CSP_NONCE,
  HSTS_MAX_AGE: parseInt(process.env.HSTS_MAX_AGE || "31536000"),
  HSTS_INCLUDE_SUBDOMAINS: process.env.HSTS_INCLUDE_SUBDOMAINS === "true",
  HSTS_PRELOAD: process.env.HSTS_PRELOAD === "true",
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = ["NEXT_PUBLIC_SITE_URL", "JWT_SECRET"];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    return false;
  }

  return true;
}

/**
 * Get environment-specific configuration
 */
export function getEnvConfig() {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isProduction = process.env.NODE_ENV === "production";

  return {
    isDevelopment,
    isProduction,
    isTest: process.env.NODE_ENV === "test",
    env: process.env.NODE_ENV || "development",
  };
}
