"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";

// Dummy featured blog data
const featuredBlogs = [
  {
    id: 1,
    title: "Building Scalable APIs with Next.js 14",
    description:
      "Learn how to create robust and scalable APIs using Next.js 14's new App Router and server components.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center",
    category: "Backend",
    readTime: "8 min read",
    author: "Devure Team",
    date: "Dec 15, 2024",
    featured: true,
  },
  {
    id: 2,
    title: "Mastering React Server Components",
    description:
      "Deep dive into React Server Components and how they revolutionize the way we build React applications.",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop&crop=center",
    category: "React",
    readTime: "12 min read",
    author: "Devure Team",
    date: "Dec 12, 2024",
    featured: true,
  },
  {
    id: 3,
    title: "Linux System Administration Essentials",
    description:
      "Essential Linux commands and system administration techniques for developers and DevOps engineers.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
    category: "Linux",
    readTime: "15 min read",
    author: "Devure Team",
    date: "Dec 10, 2024",
    featured: true,
  },
  {
    id: 4,
    title: "Modern CSS Grid Layouts",
    description:
      "Create stunning layouts with CSS Grid and learn advanced techniques for responsive design.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center",
    category: "Frontend",
    readTime: "10 min read",
    author: "Devure Team",
    date: "Dec 8, 2024",
    featured: true,
  },
  {
    id: 5,
    title: "Web Performance Optimization",
    description:
      "Comprehensive guide to optimizing web performance and improving Core Web Vitals scores.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
    category: "Web Development",
    readTime: "18 min read",
    author: "Devure Team",
    date: "Dec 5, 2024",
    featured: true,
  },
  {
    id: 6,
    title: "TypeScript Best Practices",
    description:
      "Advanced TypeScript patterns and best practices for building maintainable applications.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop&crop=center",
    category: "Frontend",
    readTime: "14 min read",
    author: "Devure Team",
    date: "Dec 3, 2024",
    featured: true,
  },
];

const Featured = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Featured Articles
        </h3>
        <p className="text-foreground/60">Handpicked articles by Us.</p>
      </div>

      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[24rem]">
        {featuredBlogs.map((blog, index) => (
          <BentoGridItem
            key={blog.id}
            className={`${
              index === 0
                ? "md:col-span-2 md:row-span-2 min-h-[32rem]"
                : "min-h-[20rem]"
            } cursor-pointer group`}
            header={
              <div className="relative w-full h-full overflow-hidden rounded-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-1 right-3 z-20">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-black">
                    {blog.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <h3 className="text-lg font-bold text-white mb-2 break-words leading-tight">
                    {blog.title}
                  </h3>
                  <div className="flex items-center justify-between text-white/80 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {blog.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {blog.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </div>
                  </div>
                </div>
              </div>
            }
            title={
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">
                  {blog.category}
                </span>
                <Button
                  size="sm"
                  className="bg-primary text-black hover:bg-primary/90 transition-all duration-200 group-hover:translate-x-1"
                >
                  Read
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            }
            description={
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground line-clamp-2">
                  {blog.title}
                </h4>
                <p className="text-sm text-foreground/70 line-clamp-3">
                  {blog.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-foreground/50">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {blog.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {blog.readTime}
                  </div>
                </div>
              </div>
            }
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default Featured;
