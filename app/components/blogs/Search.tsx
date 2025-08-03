"use client";
import React, { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Featured from "./Featured";
import { BlogPostSummary, BlogCategory } from "@/types/blog";

interface SearchProps {
  blogs: BlogPostSummary[];
  categories: BlogCategory[];
  searchQuery?: string;
  selectedCategory?: string;
}

const Search = ({
  blogs,
  categories,
  searchQuery: initialSearchQuery,
}: // selectedCategory,
SearchProps) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="w-full max-w-[110rem] flex flex-col h-auto text-background px-3 md:px-6 pb-8 lg:pb-16 pt-6">
      {/* Top Section - Text and Search */}
      <div className="w-full flex flex-col lg:flex-row gap-6 mb-2">
        {/* Left Side - Text */}
        <div className="flex-1">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Discover Our Articles
            </h2>
            <p className="text-background/70 text-lg">
              Explore insights, tutorials, and deep dives into technology
            </p>
          </div>
        </div>

        {/* Right Side - Search */}
        <div className="lg:w-80">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-foreground/60 group-focus-within:text-primary transition-colors duration-200" />
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="pl-10 pr-20 bg-background border-foreground/10 text-foreground placeholder:text-foreground/50 focus:border-secondary"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="submit"
                  className="bg-primary text-black font-bold px-3 py-1.5 rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center gap-1 text-xs"
                >
                  Search
                  <span className="text-sm">→</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full mb-6">
        <Tabs defaultValue="featured" className="w-full">
          <div className="max-w-4xl">
            <TabsList className="grid w-full grid-cols-7 bg-foreground/5 border border-foreground/10">
              <TabsTrigger
                value="featured"
                className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Featured
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category.slug}
                  value={category.slug}
                  className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-black"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="w-full text-foreground mt-6">
            <TabsContent value="featured" className="mt-0">
              <Featured blogs={filteredBlogs} />
            </TabsContent>

            {categories.map((category) => (
              <TabsContent
                key={category.slug}
                value={category.slug}
                className="mt-0"
              >
                <div className="text-center py-12">
                  <p className="text-foreground/60">
                    {category.name} content will be displayed here
                  </p>
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;
