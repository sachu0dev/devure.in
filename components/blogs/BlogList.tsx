"use client";
import React from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BlogPostSummary } from "@/types/blog";

interface BlogListProps {
  blogs: BlogPostSummary[];
  isLoading?: boolean;
}

const BlogList = ({ blogs, isLoading = false }: BlogListProps) => {
  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex gap-4 animate-pulse">
            <div className="w-24 h-24 bg-foreground/10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-foreground/10 rounded w-3/4" />
              <div className="h-3 bg-foreground/10 rounded w-1/2" />
              <div className="h-3 bg-foreground/10 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60 text-lg">
          No blogs found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {blogs.map((blog) => (
        <div
          key={blog.slug}
          className="flex gap-4 p-4 rounded-lg hover:bg-foreground/5 transition-colors duration-200 group"
        >
          {/* Thumbnail */}
          <div className="w-24 h-24 flex-shrink-0">
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                />
              </div>
            </Link>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Link href={`/blog/${blog.slug}`}>
              <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {blog.title}
              </h3>
            </Link>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/60 mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{blog.readTime || "5 min read"}</span>
              </div>
            </div>

            <p className="text-foreground/70 text-sm line-clamp-2 mb-3">
              {blog.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-primary/90 text-black text-xs font-medium px-2 py-1 rounded-full">
                  {blog.category}
                </span>
                {blog.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-foreground/10 text-foreground/70 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href={`/blog/${blog.slug}`}
                className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
              >
                see more
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
