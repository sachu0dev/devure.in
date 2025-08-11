import type {
  BlogPostSummary,
  BlogCategory,
  BlogTag,
  S3BlogPost,
} from "@/types/blog";
import { blogService } from "./blogService";

// =============================================================================
// SERVER-SIDE FUNCTIONS (MongoDB + S3)
// =============================================================================

/**
 * Get all published blogs from MongoDB (summary only - no content)
 */
export async function getAllBlogs(): Promise<BlogPostSummary[]> {
  try {
    return await blogService.getAllPublishedBlogs();
  } catch (error) {
    console.error("Error fetching blogs from database:", error);
    return [];
  }
}

/**
 * Get a blog by slug from MongoDB (full content for rendering)
 */
export async function getBlogBySlug(slug: string): Promise<S3BlogPost | null> {
  try {
    return await blogService.getBlogBySlug(slug);
  } catch (error) {
    console.error("Error fetching blog from database:", error);
    return null;
  }
}

/**
 * Get blogs by category from MongoDB (summary only - no content)
 */
export async function getBlogsByCategory(
  category: string
): Promise<BlogPostSummary[]> {
  try {
    return await blogService.getBlogsByCategory(category);
  } catch (error) {
    console.error("Error fetching blogs by category:", error);
    return [];
  }
}

/**
 * Get blogs by tag from MongoDB (summary only - no content)
 */
export async function getBlogsByTag(tag: string): Promise<BlogPostSummary[]> {
  try {
    return await blogService.getBlogsByTag(tag);
  } catch (error) {
    console.error("Error fetching blogs by tag:", error);
    return [];
  }
}

/**
 * Get all categories from MongoDB/S3
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    return await blogService.getCategories();
  } catch (error) {
    console.error("Error fetching categories from database:", error);
    return [];
  }
}

/**
 * Get all tags from MongoDB/S3
 */
export async function getAllTags(): Promise<BlogTag[]> {
  try {
    return await blogService.getTags();
  } catch (error) {
    console.error("Error fetching tags from database:", error);
    return [];
  }
}
