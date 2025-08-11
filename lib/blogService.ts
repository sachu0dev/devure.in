import dbConnect from "./mongodb";
import Blog, { IBlog } from "@/models/Blog";
import { s3Service } from "./s3";
import {
  BlogPostSummary,
  BlogSearchOptions,
  BlogSearchResults,
  BlogCategory,
  BlogTag,
  BlogStats,
  S3BlogPost,
  BlogFrontmatter,
} from "@/types/blog";

export class BlogService {
  /**
   * Create a new blog post
   */
  async createBlog(
    frontmatter: BlogFrontmatter,
    content: string,
    excerpt?: string
  ): Promise<IBlog> {
    await dbConnect();

    // Check if blog with same slug already exists
    const existingBlog = await Blog.findOne({
      "frontmatter.slug": frontmatter.slug,
    });
    if (existingBlog) {
      throw new Error(`Blog with slug "${frontmatter.slug}" already exists`);
    }

    // Validate and sanitize frontmatter data before S3 upload
    const sanitizedTitle = frontmatter.title
      .replace(/[^\x20-\x7e]/g, "")
      .trim();
    const sanitizedAuthor = frontmatter.author.name
      .replace(/[^\x20-\x7e]/g, "")
      .trim();
    const sanitizedCategory = frontmatter.category
      .replace(/[^\x20-\x7e]/g, "")
      .trim();

    // Upload content to S3
    const s3Result = await s3Service.uploadBlogContent(
      frontmatter.slug,
      content,
      {
        title: sanitizedTitle,
        author: sanitizedAuthor,
        category: sanitizedCategory,
      }
    );

    // Calculate word count
    const wordCount = content.split(/\s+/).length;

    // Create blog document
    const blog = new Blog({
      frontmatter: {
        ...frontmatter,
        publishedAt: frontmatter.draft ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      content,
      excerpt: excerpt || this.generateExcerpt(content),
      wordCount,
      source: "s3",
      s3Key: s3Result.key,
      s3Bucket: s3Service["bucket"],
      s3Region: s3Service["region"],
      lastModified: new Date().toISOString(),
      etag: s3Result.etag,
    });

    return await blog.save();
  }

  /**
   * Update an existing blog post
   */
  async updateBlog(
    slug: string,
    frontmatter: Partial<BlogFrontmatter>,
    content?: string,
    excerpt?: string
  ): Promise<IBlog> {
    await dbConnect();

    const blog = await Blog.findOne({ "frontmatter.slug": slug });
    if (!blog) {
      throw new Error(`Blog with slug "${slug}" not found`);
    }

    // Update content in S3 if provided
    if (content) {
      const s3Result = await s3Service.uploadBlogContent(slug, content, {
        title: frontmatter.title || blog.frontmatter.title,
        author: frontmatter.author?.name || blog.frontmatter.author.name,
        category: frontmatter.category || blog.frontmatter.category,
      });

      blog.content = content;
      blog.s3Key = s3Result.key;
      blog.etag = s3Result.etag;
      blog.lastModified = new Date().toISOString();
      blog.wordCount = content.split(/\s+/).length;
    }

    // Update frontmatter
    if (frontmatter) {
      blog.frontmatter = {
        ...blog.frontmatter,
        ...frontmatter,
        updatedAt: new Date().toISOString(),
      };
    }

    // Update excerpt if provided
    if (excerpt) {
      blog.excerpt = excerpt;
    } else if (content) {
      blog.excerpt = this.generateExcerpt(content);
    }

    return await blog.save();
  }

  /**
   * Delete a blog post
   */
  async deleteBlog(slug: string): Promise<void> {
    await dbConnect();

    const blog = await Blog.findOne({ "frontmatter.slug": slug });
    if (!blog) {
      throw new Error(`Blog with slug "${slug}" not found`);
    }

    // Delete from S3
    await s3Service.deleteBlogContent(slug);

    // Delete from database
    await Blog.deleteOne({ "frontmatter.slug": slug });
  }

  /**
   * Get a blog post by slug
   */
  async getBlogBySlug(slug: string): Promise<S3BlogPost | null> {
    await dbConnect();

    const blog = await Blog.findOne({ "frontmatter.slug": slug });
    if (!blog) {
      return null;
    }

    return this.blogToS3BlogPost(blog);
  }

  /**
   * Get all published blogs (optimized - excludes content field)
   */
  async getAllPublishedBlogs(): Promise<BlogPostSummary[]> {
    try {
      await dbConnect();

      const blogs = await Blog.find(
        { "frontmatter.draft": false },
        { content: 0 }
      ).sort({
        "frontmatter.date": -1,
      });

      return blogs.map((blog) => {
        try {
          return blog.toSummary();
        } catch (error) {
          console.error("Error converting blog to summary:", error);
          // Return a safe fallback
          return {
            slug: blog.frontmatter?.slug || "unknown",
            title: blog.frontmatter?.title || "Unknown Title",
            description: blog.frontmatter?.description || "",
            category: blog.frontmatter?.category || "uncategorized",
            tags: Array.isArray(blog.frontmatter?.tags)
              ? blog.frontmatter.tags
              : [],
            date: blog.frontmatter?.date || new Date().toISOString(),
            coverImage: blog.frontmatter?.coverImage || "",
            author: {
              name: blog.frontmatter?.author?.name || "Unknown Author",
              profileUrl:
                blog.frontmatter?.author?.profileUrl || "/authors/unknown",
            },
            readTime: blog.frontmatter?.readTime || "5 min read",
            featured: Boolean(blog.frontmatter?.featured),
            source: "s3",
            excerpt: blog.excerpt || "",
            wordCount: blog.wordCount || 0,
          };
        }
      });
    } catch (error) {
      console.error("Error fetching published blogs:", error);
      return [];
    }
  }

  /**
   * Get all blogs (including drafts) for admin (optimized - excludes content field)
   */
  async getAllBlogs(): Promise<BlogPostSummary[]> {
    await dbConnect();

    const blogs = await Blog.find(
      {},
      { content: 0 } // Exclude content field for better performance
    ).sort({ "frontmatter.date": -1 });

    return blogs.map((blog) => blog.toSummary());
  }

  /**
   * Get featured blogs (optimized - excludes content field)
   */
  async getFeaturedBlogs(): Promise<BlogPostSummary[]> {
    await dbConnect();

    const blogs = await Blog.find(
      {
        "frontmatter.featured": true,
        "frontmatter.draft": false,
      },
      { content: 0 } // Exclude content field for better performance
    ).sort({ "frontmatter.date": -1 });

    return blogs.map((blog) => blog.toSummary());
  }

  /**
   * Get blogs by category (optimized - excludes content field)
   */
  async getBlogsByCategory(category: string): Promise<BlogPostSummary[]> {
    await dbConnect();

    const blogs = await Blog.find(
      {
        "frontmatter.category": category,
        "frontmatter.draft": false,
      },
      { content: 0 } // Exclude content field for better performance
    ).sort({ "frontmatter.date": -1 });

    return blogs.map((blog) => blog.toSummary());
  }

  /**
   * Get blogs by tag (optimized - excludes content field)
   */
  async getBlogsByTag(tag: string): Promise<BlogPostSummary[]> {
    await dbConnect();

    const blogs = await Blog.find(
      {
        "frontmatter.tags": tag,
        "frontmatter.draft": false,
      },
      { content: 0 } // Exclude content field for better performance
    ).sort({ "frontmatter.date": -1 });

    return blogs.map((blog) => blog.toSummary());
  }

  /**
   * Search blogs
   */
  async searchBlogs(options: BlogSearchOptions): Promise<BlogSearchResults> {
    await dbConnect();

    const {
      query,
      category,
      tags,
      author,
      featured,
      dateRange,
      sortBy = "date",
      sortOrder = "desc",
      limit = 10,
      offset = 0,
    } = options;

    // Build query
    const queryFilter: Record<string, unknown> = { "frontmatter.draft": false };

    if (query) {
      queryFilter.$text = { $search: query };
    }

    if (category) {
      queryFilter["frontmatter.category"] = category;
    }

    if (tags && tags.length > 0) {
      queryFilter["frontmatter.tags"] = { $in: tags };
    }

    if (author) {
      queryFilter["frontmatter.author.name"] = author;
    }

    if (featured !== undefined) {
      queryFilter["frontmatter.featured"] = featured;
    }

    if (dateRange) {
      queryFilter["frontmatter.date"] = {
        $gte: dateRange.start.toISOString(),
        $lte: dateRange.end.toISOString(),
      };
    }

    // Build sort
    const sort: { [key: string]: 1 | -1 | { $meta: string } } = {};
    if (query) {
      sort.score = { $meta: "textScore" };
    }
    sort[`frontmatter.${sortBy}`] = sortOrder === "desc" ? -1 : 1;

    // Execute query (optimized - excludes content field for better performance)
    const blogs = await Blog.find(queryFilter, {
      content: 0, // Exclude content field for better performance
      ...(query ? { score: { $meta: "textScore" } } : {}),
    })
      .sort(sort)
      .limit(limit)
      .skip(offset);

    const total = await Blog.countDocuments(queryFilter);

    return {
      posts: blogs.map((blog) => blog.toSummary()),
      total,
      hasMore: offset + limit < total,
      categories: [], // Simplified to avoid circular references
      tags: [], // Simplified to avoid circular references
    };
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<BlogCategory[]> {
    await dbConnect();

    // Use a simpler approach to avoid potential circular references
    const categories = await Blog.distinct("frontmatter.category", {
      "frontmatter.draft": false,
    });

    // Get post count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Blog.countDocuments({
          "frontmatter.category": category,
          "frontmatter.draft": false,
        });

        return {
          name: category,
          slug: category,
          postCount,
          featured: false,
        };
      })
    );

    // Sort by post count descending
    return categoriesWithCount.sort((a, b) => b.postCount - a.postCount);
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<BlogTag[]> {
    await dbConnect();

    // Use a simpler approach to avoid potential circular references
    const allTags = await Blog.find(
      { "frontmatter.draft": false },
      { "frontmatter.tags": 1 }
    );

    // Flatten and count tags
    const tagCounts = new Map<string, number>();
    allTags.forEach((blog) => {
      blog.frontmatter.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Convert to array and sort
    const tags = Array.from(tagCounts.entries()).map(([name, postCount]) => ({
      name,
      slug: name,
      postCount,
    }));

    return tags.sort((a, b) => b.postCount - a.postCount);
  }

  /**
   * Get blog statistics
   */
  async getBlogStats(): Promise<BlogStats> {
    await dbConnect();

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      totalWords,
      categories,
      tags,
      authors,
    ] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ "frontmatter.draft": false }),
      Blog.countDocuments({ "frontmatter.draft": true }),
      Blog.countDocuments({
        "frontmatter.featured": true,
        "frontmatter.draft": false,
      }),
      Blog.aggregate([
        { $group: { _id: null, total: { $sum: "$wordCount" } } },
      ]),
      Blog.distinct("frontmatter.category"),
      Blog.aggregate([
        { $unwind: "$frontmatter.tags" },
        { $group: { _id: "$frontmatter.tags" } },
        { $count: "total" },
      ]),
      Blog.distinct("frontmatter.author.name"),
    ]);

    const avgReadTime =
      publishedPosts > 0
        ? Math.round(totalWords[0]?.total / publishedPosts / 200)
        : 0;

    return {
      totalPosts,
      totalCategories: categories.length,
      totalTags: tags[0]?.total || 0,
      totalAuthors: authors.length,
      totalWords: totalWords[0]?.total || 0,
      averageReadTime: avgReadTime,
      featuredPosts,
      draftPosts,
    };
  }

  /**
   * Toggle blog draft status
   */
  async toggleDraftStatus(slug: string): Promise<IBlog> {
    await dbConnect();

    const blog = await Blog.findOne({ "frontmatter.slug": slug });
    if (!blog) {
      throw new Error(`Blog with slug "${slug}" not found`);
    }

    const isDraft = blog.frontmatter.draft;
    blog.frontmatter.draft = !isDraft;

    if (!isDraft) {
      // Publishing
      blog.frontmatter.publishedAt = new Date().toISOString();
    } else {
      // Unpublishing
      blog.frontmatter.publishedAt = undefined;
    }

    blog.frontmatter.updatedAt = new Date().toISOString();

    return await blog.save();
  }

  /**
   * Toggle blog featured status
   */
  async toggleFeaturedStatus(slug: string): Promise<IBlog> {
    await dbConnect();

    const blog = await Blog.findOne({ "frontmatter.slug": slug });
    if (!blog) {
      throw new Error(`Blog with slug "${slug}" not found`);
    }

    blog.frontmatter.featured = !blog.frontmatter.featured;
    blog.frontmatter.updatedAt = new Date().toISOString();

    return await blog.save();
  }

  /**
   * Convert MongoDB blog to S3BlogPost
   */
  private blogToS3BlogPost(blog: IBlog): S3BlogPost {
    // Safely extract frontmatter to avoid circular references
    const frontmatter = {
      title: blog.frontmatter.title || "",
      slug: blog.frontmatter.slug || "",
      description: blog.frontmatter.description || "",
      tags: Array.isArray(blog.frontmatter.tags) ? blog.frontmatter.tags : [],
      category: blog.frontmatter.category || "",
      date: blog.frontmatter.date || new Date().toISOString(),
      coverImage: blog.frontmatter.coverImage || "",
      ogImage: blog.frontmatter.ogImage || "",
      author: blog.frontmatter.author
        ? {
            name: blog.frontmatter.author.name || "Unknown Author",
            profileUrl:
              blog.frontmatter.author.profileUrl || "/authors/unknown",
          }
        : {
            name: "Unknown Author",
            profileUrl: "/authors/unknown",
          },
      readTime: blog.frontmatter.readTime || "5 min read",
      featured: Boolean(blog.frontmatter.featured),
      draft: Boolean(blog.frontmatter.draft),
      publishedAt: blog.frontmatter.publishedAt,
      updatedAt: blog.frontmatter.updatedAt,
      seo: blog.frontmatter.seo,
    };

    return {
      frontmatter,
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      wordCount: blog.wordCount || 0,
      source: "s3",
      s3Key: blog.s3Key || "",
      s3Bucket: blog.s3Bucket || "",
      s3Region: blog.s3Region,
      lastModified: blog.lastModified,
      etag: blog.etag,
    };
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 160): string {
    try {
      // Ensure content is a string
      const contentStr = String(content || "");

      // Remove markdown formatting
      const plainText = contentStr
        .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
        .replace(/[*_`~]/g, "") // Remove markdown formatting
        .replace(/\n+/g, " ") // Replace newlines with spaces
        .trim();

      if (plainText.length <= maxLength) {
        return plainText;
      }

      return plainText.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
    } catch (error) {
      console.error("Error generating excerpt:", error);
      return "Read more...";
    }
  }
}

// Export singleton instance
export const blogService = new BlogService();
