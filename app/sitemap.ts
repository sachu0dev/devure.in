import { MetadataRoute } from "next";
import { getAllBlogs, getAllCategories, getAllTags } from "@/lib/blog";
import { getAllServices } from "@/lib/services";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Get all blog and service data
  const [blogs, categories, tags, services] = await Promise.all([
    getAllBlogs(),
    getAllCategories(),
    getAllTags(),
    getAllServices(),
  ]);

  // Base pages
  const basePages = [
    {
      url: currentDomain,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${currentDomain}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ];

  // Blog post pages
  const blogPages = blogs.map((blog) => ({
    url: `${canonicalDomain}/blog/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${canonicalDomain}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Tag pages
  const tagPages = tags.map((tag) => ({
    url: `${canonicalDomain}/blog/tag/${tag.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Service pages
  const servicePages = services.map((service) => {
    // Validate and parse date with fallback
    let lastModified: Date;
    try {
      const dateValue = service.updatedAt || service.createdAt;
      lastModified = dateValue ? new Date(dateValue) : new Date();
    } catch {
      lastModified = new Date();
    }

    return {
      url: `${canonicalDomain}/service/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [
    ...basePages,
    ...blogPages,
    ...categoryPages,
    ...tagPages,
    ...servicePages,
  ];
}
