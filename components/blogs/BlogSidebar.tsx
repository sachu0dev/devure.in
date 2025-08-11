"use client";
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { BlogCategory } from "@/types/blog";

interface BlogSidebarProps {
  categories: BlogCategory[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

const BlogSidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
}: BlogSidebarProps) => {
  const [categoriesExpanded, setCategoriesExpanded] = React.useState(true);

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Categories */}
      <div className="bg-background border border-foreground/10 rounded-lg p-4">
        <button
          onClick={() => setCategoriesExpanded(!categoriesExpanded)}
          className="flex items-center justify-between w-full text-left font-semibold text-foreground mb-3"
        >
          <span>Categories</span>
          {categoriesExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {categoriesExpanded && (
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={(e) =>
                    onCategoryChange(category.slug, e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-foreground/20 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm">{category.name}</span>
                <span className="text-xs text-foreground/50 ml-auto">
                  ({category.postCount})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogSidebar;
