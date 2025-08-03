import { MetadataRoute } from "next";
import { getAllBlogs, getAllCategories, getAllTags } from "@/lib/blog";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const baseUrl = env.SITE_URL;

    // Get dynamic data from MongoDB
    const [blogs, categories, tags] = await Promise.all([
      getAllBlogs(),
      getAllCategories(),
      getAllTags(),
    ]);

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];

    // Blog posts
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.date),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/blog/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    // Tag pages
    const tagPages: MetadataRoute.Sitemap = tags.map((tag) => ({
      url: `${baseUrl}/blog/tag/${tag.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    }));

    // Combine all pages
    const sitemap = [
      ...staticPages,
      ...blogPages,
      ...categoryPages,
      ...tagPages,
    ];

    console.log(`Generated sitemap with ${sitemap.length} URLs`);

    return sitemap;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return basic sitemap if there's an error
    return [
      {
        url: env.SITE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${env.SITE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];
  }
}
