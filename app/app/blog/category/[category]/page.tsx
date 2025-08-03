import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogsByCategory, getAllCategories } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = params.category;
  const blogs = getBlogsByCategory(category);

  if (blogs.length === 0) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category} Articles - Devure Blog`,
    description: `Browse all ${category} articles and tutorials on Devure.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category;
  const blogs = getBlogsByCategory(category);

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
            {category} Articles
          </h1>
          <p className="text-xl text-foreground/70">
            {blogs.length} article{blogs.length !== 1 ? "s" : ""} in {category}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.frontmatter.slug} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}
