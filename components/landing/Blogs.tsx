import React from "react";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";

interface Blog {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  coverImage: string;
  author: {
    name: string;
    profileUrl: string;
    avatar?: string;
    bio?: string;
  };
  readTime: string;
  featured: boolean;
  excerpt?: string;
  wordCount?: number;
}

interface BlogsProps {
  featuredBlogs: Blog[];
}

const Blogs = ({ featuredBlogs }: BlogsProps) => {
  return (
    <div className="w-full flex flex-col items-center px-3 md:px-6 pb-8 lg:pb-16 pt-[6rem]">
      {/* Header Section */}
      <div className="text-center mb-12 lg:mb-20 w-full opacity-100">
        <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[5rem] font-bold text-forground leading-[1.1] max-w-5xl mx-auto">
          INSIGHTS & TUTORIALS
          <br />
          BY DEVURE
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-forground/80 mt-6 max-w-4xl mx-auto">
          Explore our collection of thought-provoking articles, expert insights,
          and in-depth tutorials. Stay updated with the latest in technology,
          development practices, and industry trends.
        </p>
      </div>

      {/* Blog Cards Section */}
      <div className="w-full px-3 md:px-6  mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredBlogs.map((blog) => (
            <div key={blog.slug} className="overflow-hidden opacity-100">
              {/* Blog Card Visual Area */}
              <div className="h-48 relative overflow-hidden bg-[#24968d] rounded-xl">
                {/* Diagonal Arrow */}
                <div className="absolute bottom-3 left-3 w-8 h-8 text-white/60 text-2xl z-10">
                  ↗
                </div>

                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Blog Content */}
              <div className="py-6 ">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.tags?.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 text-sm  border border-foreground text-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    key="date"
                    className="px-3 py-1 text-xs font-medium text-foreground rounded-full"
                  >
                    {blog.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl  text-foreground leading-tight mb-4 hover:underline ">
                  {blog.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center px-3 md:px-18 mt-8 opacity-100">
        <div className="inline-flex items-center gap-3 bg-primary text-[#242424] px-8 py-4 rounded-2xl font-semibold text-lg  transition-colors duration-300 cursor-pointer group font-figtree">
          <span>View More</span>
          <IconArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
