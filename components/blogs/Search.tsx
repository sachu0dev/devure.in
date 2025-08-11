"use client";
import React from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Featured from "./Featured";
import BlogList from "./BlogList";
import BlogSidebar from "./BlogSidebar";
import { useBlogSearch } from "@/hooks/useBlogSearch";
import { BlogPostSummary, BlogCategory, BlogTag } from "@/types/blog";

interface SearchProps {
  blogs: BlogPostSummary[];
  categories: BlogCategory[];
  tags: BlogTag[];
}

const Search = ({ blogs, categories, tags }: SearchProps) => {
  const {
    blogs: filteredBlogs,
    isLoading,
    error,
    searchQuery,
    selectedCategories,
    selectedTags,
    setSearchQuery,
    setSelectedCategories,
    clearFilters,
    hasActiveFilters,
    handleTagClick,
  } = useBlogSearch(blogs);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleTagClickFromSidebar = (tagName: string) => {
    handleTagClick(tagName);
    // Optionally add the tag to search query
    if (!searchQuery.includes(tagName)) {
      setSearchQuery(searchQuery ? `${searchQuery} ${tagName}` : tagName);
    }
  };

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
            <p className="text-foreground/80 text-lg">
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

          {/* Tags below search - using server-side tags */}
          {tags.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-foreground/60 mb-2">Popular tags:</p>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 6).map((tag) => (
                  <button
                    key={tag.slug}
                    onClick={() => handleTagClickFromSidebar(tag.name)}
                    className="inline-block bg-foreground/10 hover:bg-primary/20 text-foreground/70 hover:text-primary text-xs px-2 py-1 rounded-full transition-all duration-200 cursor-pointer"
                    title={`${tag.postCount} posts`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-full mb-6">
        <Tabs defaultValue="featured" className="w-full">
          <div className="max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-foreground/5 border border-foreground/10">
              <TabsTrigger
                value="featured"
                className="text-sm  data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                Featured
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="text-sm data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                All Articles
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="w-full text-foreground mt-6">
            <TabsContent value="featured" className="mt-0">
              <Featured blogs={blogs} />
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <div className="flex flex-col lg:flex-row gap-8 ">
                {/* Main Content - Blog List */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {hasActiveFilters ? "Search Results" : "All Articles"}
                    </h3>
                    {hasActiveFilters && (
                      <p className="text-foreground/60 text-sm">
                        {filteredBlogs.length} articles found
                        {searchQuery && ` for "${searchQuery}"`}
                        {selectedCategories.length > 0 &&
                          ` in ${selectedCategories
                            .map(
                              (cat) =>
                                categories.find((c) => c.slug === cat)?.name
                            )
                            .filter(Boolean)
                            .join(", ")}`}
                        {selectedTags.length > 0 &&
                          ` tagged with ${selectedTags.join(", ")}`}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="text-red-500 text-center py-8">
                      Error: {error}
                    </div>
                  )}

                  <BlogList blogs={filteredBlogs} isLoading={isLoading} />
                </div>

                {/* Sidebar (categories only) */}
                <div className="lg:w-80 flex-shrink-0">
                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <div className="w-full mb-4 flex justify-end">
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        size="sm"
                        className="text-foreground/70 hover:text-foreground border-foreground/20"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                  <BlogSidebar
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;
