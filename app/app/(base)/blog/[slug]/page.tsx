import { getAllBlogs, getBlogBySlug } from "@/lib/blog";
import { Calendar, Clock, Tag, User } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/BlogContent";
import { getCurrentDomain, getCanonicalDomain } from "@/lib/utils";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ISR: Revalidate every 6 hours
export const revalidate = 21600; // 6 hours in seconds

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
      description: "The requested blog post could not be found.",
    };
  }

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  const url = `${canonicalDomain}/blog/${blog.frontmatter.slug}`;
  const publishedTime = new Date(blog.frontmatter.date).toISOString();
  const modifiedTime = blog.frontmatter.updatedAt
    ? new Date(blog.frontmatter.updatedAt).toISOString()
    : publishedTime;

  return {
    title: `${blog.frontmatter.title} | Devure`,
    description: blog.frontmatter.description,
    keywords: blog.frontmatter.tags.join(", "),
    authors: [{ name: blog.frontmatter.author.name }],
    creator: blog.frontmatter.author.name,
    publisher: "Devure",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(currentDomain),
    openGraph: {
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      url,
      siteName: "Devure",
      images: [
        {
          url: blog.frontmatter.ogImage,
          width: 1200,
          height: 630,
          alt: blog.frontmatter.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [blog.frontmatter.author.name],
      tags: blog.frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [blog.frontmatter.ogImage],
      creator: "@devure",
      site: "@devure",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": blog.frontmatter.author.name,
      "article:section": blog.frontmatter.category,
      "article:tag": blog.frontmatter.tags.join(", "),
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": blog.frontmatter.title,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Get current domain dynamically
  const currentDomain = getCurrentDomain();
  const canonicalDomain = getCanonicalDomain();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.frontmatter.title,
    description: blog.frontmatter.description,
    image: blog.frontmatter.coverImage,
    author: {
      "@type": "Person",
      name: blog.frontmatter.author.name,
      url: blog.frontmatter.author.profileUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Devure",
      url: currentDomain,
      logo: {
        "@type": "ImageObject",
        url: `${currentDomain}/logo.png`,
      },
    },
    datePublished: blog.frontmatter.date,
    dateModified: blog.frontmatter.updatedAt || blog.frontmatter.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${canonicalDomain}/blog/${blog.frontmatter.slug}`,
    },
    articleSection: blog.frontmatter.category,
    keywords: blog.frontmatter.tags.join(", "),
    wordCount: blog.wordCount || 0,
    timeRequired: blog.frontmatter.readTime || "PT5M",
  };

  return (
    <article className="min-h-screen bg-background pt-[6rem]">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

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
      <header className="max-w-4xl mx-auto px-4 mb-12">
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
      </header>

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

      <main className="max-w-4xl mx-auto px-4 pb-16">
        <BlogContent content={blog.content} />
      </main>
    </article>
  );
}
