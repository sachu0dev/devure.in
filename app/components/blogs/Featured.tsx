"use client";
import React from "react";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BlogPostSummary } from "@/types/blog";

interface FeaturedProps {
  blogs: BlogPostSummary[];
}

const Featured = ({ blogs }: FeaturedProps) => {
  console.log(blogs);
  return (
    <section className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Featured Articles
        </h3>
        <p className="text-foreground/60">Handpicked articles by Us.</p>
      </div>

      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[24rem]">
        {blogs.map((blog, index) => (
          <BentoGridItem
            key={blog.slug}
            className={
              index === 0
                ? "md:col-span-2 md:row-span-2 min-h-[32rem]"
                : "min-h-[20rem]"
            }
            header={
              <Link
                href={`/blog/${blog.slug}`}
                className="relative w-full h-full block rounded-xl overflow-hidden group"
              >
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10" />
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {blog.author.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime || "5 min read"}
                    </div>
                  </div>
                </div>
              </Link>
            }
            title={
              <div className="flex justify-between items-center mt-2">
                <span className="inline-block bg-primary/90 text-black text-xs font-medium px-2 py-0.5 rounded-full">
                  {blog.category}
                </span>
                <Button
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/90 text-xs h-7 px-3 py-1"
                >
                  Read
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            }
            description={
              <div className="space-y-2 mt-2">
                <p className="font-semibold text-foreground line-clamp-2 text-sm">
                  {blog.title}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {blog.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {blog.author.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime || "5 min read"}
                  </div>
                </div>
              </div>
            }
            icon={null}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default Featured;
