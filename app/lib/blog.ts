import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  LocalBlogPost,
  BlogPostSummary,
  BlogFrontmatter,
} from "@/types/blog";

const blogsDirectory = path.join(process.cwd(), "content", "blogs");

export function getAllBlogs(): LocalBlogPost[] {
  const fileNames = fs.readdirSync(blogsDirectory);
  const allBlogsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        source: "local" as const,
        filePath: fullPath,
        fileName,
        frontmatter: data as BlogFrontmatter,
        content,
      } as LocalBlogPost;
    });

  return allBlogsData.sort((a, b) => {
    return (
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
    );
  });
}

export function getBlogBySlug(slug: string): LocalBlogPost | null {
  try {
    const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      source: "local" as const,
      filePath: fullPath,
      fileName: `${slug}.mdx`,
      frontmatter: data as BlogFrontmatter,
      content,
    } as LocalBlogPost;
  } catch {
    return null;
  }
}

export function getBlogsByCategory(category: string): LocalBlogPost[] {
  const blogs = getAllBlogs();
  return blogs.filter((blog) => blog.frontmatter.category === category);
}

export function getBlogsByTag(tag: string): LocalBlogPost[] {
  const blogs = getAllBlogs();
  return blogs.filter((blog) => blog.frontmatter.tags.includes(tag));
}

export function getAllCategories(): string[] {
  const blogs = getAllBlogs();
  const categories = blogs.map((blog) => blog.frontmatter.category);
  return [...new Set(categories)];
}

export function getAllTags(): string[] {
  const blogs = getAllBlogs();
  const tags = blogs.flatMap((blog) => blog.frontmatter.tags);
  return [...new Set(tags)];
}

// Helper function to convert BlogPost to BlogPostSummary
export function toBlogPostSummary(blog: LocalBlogPost): BlogPostSummary {
  return {
    slug: blog.frontmatter.slug,
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
    category: blog.frontmatter.category,
    tags: blog.frontmatter.tags,
    date: blog.frontmatter.date,
    coverImage: blog.frontmatter.coverImage,
    author: blog.frontmatter.author,
    readTime: blog.frontmatter.readTime || "5 min read",
    featured: blog.frontmatter.featured || false,
    source: "local",
    excerpt: blog.excerpt,
    wordCount: blog.wordCount,
  };
}
