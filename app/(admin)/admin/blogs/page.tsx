"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { BlogPostSummary } from "@/types/blog";
import {
  getAdminBlogs,
  deleteBlog,
  toggleBlogDraftStatus,
  handleApiError,
} from "@/lib/api";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<BlogPostSummary[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPostSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadBlogs();
  }, [router]);

  const filterBlogs = useCallback(() => {
    let filtered = blogs;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((blog) => {
        if (statusFilter === "published") return !blog.featured; // Assuming featured means draft
        if (statusFilter === "draft") return blog.featured; // Assuming featured means draft
        if (statusFilter === "featured") return blog.featured;
        return true;
      });
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchQuery, statusFilter]);

  useEffect(() => {
    filterBlogs();
  }, [filterBlogs]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminBlogs({
        page: 1,
        limit: 50,
        status: "all",
      });

      // Ensure we have the correct data structure
      if (response && response.data && Array.isArray(response.data)) {
        setBlogs(response.data);
      } else {
        console.warn("Unexpected blogs response structure:", response);
        setBlogs([]);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading blogs:", errorMessage);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(blogId);
        setBlogs(blogs.filter((blog) => blog.slug !== blogId));
      } catch (error) {
        const errorMessage = handleApiError(error);
        alert(`Failed to delete blog: ${errorMessage}`);
      }
    }
  };

  const handleToggleStatus = async (blog: BlogPostSummary) => {
    try {
      const updatedBlog = await toggleBlogDraftStatus(blog.slug);
      setBlogs(blogs.map((b) => (b.slug === blog.slug ? updatedBlog : b)));
    } catch (error) {
      const errorMessage = handleApiError(error);
      alert(`Failed to toggle blog status: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blogs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading blogs</div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <Button onClick={loadBlogs}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Link href="/admin/blogs/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Blog
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blog
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog.slug} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={blog.coverImage}
                          alt={blog.title}
                          width={40}
                          height={40}
                          unoptimized={blog.coverImage?.startsWith("https://")}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {blog.description.substring(0, 60)}...
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="flex items-center text-xs text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {blog.readTime}
                          </span>
                          {blog.featured && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        blog.featured // Assuming featured means draft
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {blog.featured ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {blog.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {blog.author.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/blog/${blog.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/blogs/edit/${blog.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(blog)}
                      >
                        {blog.featured ? "Publish" : "Unpublish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog.slug)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
