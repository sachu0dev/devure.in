import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  blog: BlogPost;
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={blog.frontmatter.coverImage}
          alt={blog.frontmatter.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {blog.frontmatter.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${blog.frontmatter.slug}`}>
            {blog.frontmatter.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-foreground/70 line-clamp-3 leading-relaxed">
          {blog.frontmatter.description}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-foreground/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{blog.frontmatter.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(blog.frontmatter.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{blog.frontmatter.readTime || "5 min"}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {blog.frontmatter.tags.slice(0, 3).map((tag: string) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-foreground/5 text-foreground/70 hover:bg-foreground/10 transition-colors"
            >
              #{tag}
            </Link>
          ))}
          {blog.frontmatter.tags.length > 3 && (
            <span className="text-xs text-foreground/50">
              +{blog.frontmatter.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read More Button */}
        <div className="pt-2">
          <Link href={`/blog/${blog.frontmatter.slug}`}>
            <Button
              variant="ghost"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
            >
              Read Article
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
