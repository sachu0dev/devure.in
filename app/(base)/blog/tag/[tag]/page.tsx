import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogsByTag, getAllTags } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({
    tag: tag.slug.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const blogs = await getBlogsByTag(tag);

  if (blogs.length === 0) {
    return {
      title: "Tag Not Found",
    };
  }

  return {
    title: `#${tag} Articles - Devure Blog`,
    description: `Browse all articles tagged with #${tag} on Devure.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const blogs = await getBlogsByTag(tag);

  if (blogs.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            #{tag} Articles
          </h1>
          <p className="text-xl text-foreground/70">
            {blogs.length} article{blogs.length !== 1 ? "s" : ""} tagged with #
            {tag}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.slug} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
