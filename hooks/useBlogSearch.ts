import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBlogs } from "@/lib/api";
import { BlogSearchOptions, BlogPostSummary } from "@/types/blog";

export const useBlogSearch = (initialBlogs: BlogPostSummary[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Build search options
  const searchOptions: BlogSearchOptions = useMemo(() => {
    const options: BlogSearchOptions = {
      limit: 50,
    };

    if (searchQuery.trim()) {
      options.query = searchQuery.trim();
    }

    if (selectedCategories.length > 0) {
      options.category = selectedCategories[0];
    }

    if (selectedTags.length > 0) {
      options.tags = selectedTags;
    }

    return options;
  }, [searchQuery, selectedCategories, selectedTags]);

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim().length > 0 ||
      selectedCategories.length > 0 ||
      selectedTags.length > 0
    );
  }, [searchQuery, selectedCategories, selectedTags]);

  // Fetch blogs with search and filters - only when there are active filters
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogs", searchOptions],
    queryFn: () => getBlogs(searchOptions),
    enabled: Boolean(hasActiveFilters),
    staleTime: 5 * 60 * 1000,
  });

  // Determine which blogs to show
  const blogs = useMemo(() => {
    if (hasActiveFilters && searchResults) {
      return searchResults.posts;
    }
    return initialBlogs;
  }, [hasActiveFilters, searchResults, initialBlogs]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  // Handle tag selection
  const handleTagClick = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  return {
    blogs,
    isLoading,
    error: error ? String(error) : null,
    searchQuery,
    selectedCategories,
    selectedTags,
    setSearchQuery,
    setSelectedCategories,
    setSelectedTags,
    clearFilters,
    hasActiveFilters,
    handleTagClick,
  };
};
