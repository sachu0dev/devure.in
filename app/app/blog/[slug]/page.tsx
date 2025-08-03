import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogBySlug, getAllBlogs } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import { BlogSEO } from "@/components/BlogSEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CodeBlock } from "@/components/CodeBlock";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.frontmatter.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

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
    },
    twitter: {
      card: "summary_large_image",
      title: blog.frontmatter.title,
      description: blog.frontmatter.description,
      images: [blog.frontmatter.ogImage],
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <>
      <BlogSEO blog={blog} />

      <article className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
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

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 pb-16">
          <div
            className="prose prose-lg max-w-none 
            prose-headings:text-foreground prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-primary prose-code:bg-foreground/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:border prose-pre:border-gray-700
            prose-pre:shadow-lg prose-pre:my-6
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-foreground/80 prose-li:mb-1
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/70
            prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6
            prose-hr:border-foreground/20 prose-hr:my-8
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:border prose-th:border-foreground/20 prose-th:px-4 prose-th:py-2 prose-th:bg-foreground/5
            prose-td:border prose-td:border-foreground/20 prose-td:px-4 prose-td:py-2
            [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
          >
            <MDXRemote
              source={blog.content}
              components={{
                pre: (props) => <CodeBlock {...props} />,
              }}
            />
          </div>
        </div>
      </article>
    </>
  );
}
