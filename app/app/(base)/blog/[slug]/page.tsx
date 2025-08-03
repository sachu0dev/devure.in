import { getAllBlogs, getBlogBySlug } from "@/lib/blog";
import { Calendar, Clock, Tag, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "@/lib/env";
import { BlogContent } from "@/components/BlogContent";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const url = `${env.SITE_URL}/blog/${blog.frontmatter.slug}`;

  return {
    title: blog.frontmatter.title,
    description: blog.frontmatter.description,
    openGraph: {
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [blog.frontmatter.ogImage],
      type: "article",
      publishedTime: blog.frontmatter.date,
      authors: [blog.frontmatter.author.name],
      url,
      siteName: env.SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [blog.frontmatter.ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:published_time": blog.frontmatter.date,
      "article:author": blog.frontmatter.author.name,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link> */}
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="space-y-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {blog.frontmatter.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            {blog.frontmatter.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-foreground/70 leading-relaxed">
            {blog.frontmatter.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/60">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{blog.frontmatter.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(blog.frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.frontmatter.readTime || "5 min read"}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-foreground/60" />
            {blog.frontmatter.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-foreground/5 text-foreground/70 hover:bg-foreground/10 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.frontmatter.coverImage && (
        <div className="max-w-4xl mx-auto px-4 mb-12">
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden">
            <Image
              src={blog.frontmatter.coverImage}
              alt={blog.frontmatter.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-16">
        <BlogContent content={blog.content} />
      </div>
    </article>
  );
}
