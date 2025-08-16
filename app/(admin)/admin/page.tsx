"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Eye,
  TrendingUp,
  Calendar,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getBlogStats,
  getAdminBlogs,
  handleApiError,
  adminLogout,
} from "@/lib/api";
import { BlogPostSummary, BlogStats } from "@/types/blog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboard() {
  const [stats, setStats] = useState<BlogStats>({
    totalPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalAuthors: 0,
    totalWords: 0,
    averageReadTime: 0,
    featuredPosts: 0,
    draftPosts: 0,
  });
  const [recentBlogs, setRecentBlogs] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    // Check authentication
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // Load dashboard data only if authenticated
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, authLoading, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats and recent blogs in parallel
      const [statsData, blogsResponse] = await Promise.all([
        getBlogStats(),
        getAdminBlogs({ page: 1, limit: 5, status: "all" }),
      ]);

      setStats(statsData);

      // Ensure we have the correct data structure
      if (
        blogsResponse &&
        blogsResponse.data &&
        Array.isArray(blogsResponse.data)
      ) {
        setRecentBlogs(blogsResponse.data);
      } else {
        console.warn("Unexpected blogs response structure:", blogsResponse);
        setRecentBlogs([]);
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading dashboard data:", errorMessage);
      setRecentBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
      logout(); // Use the logout function from useAuth hook
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
      // Fallback to local logout if API fails
      logout();
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Checking authentication...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            Error loading dashboard
          </div>
          <div className="text-sm text-gray-600 mb-4">{error}</div>
          <Button onClick={loadDashboardData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to the Devure admin panel</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/blogs/create">
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Create New Blog
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPosts - stats.draftPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.draftPosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.featuredPosts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Blogs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Blogs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.isArray(recentBlogs) && recentBlogs.length > 0 ? (
            recentBlogs.map((blog) => (
              <div
                key={blog.slug}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        blog.featured ? "bg-green-400" : "bg-yellow-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {blog.title}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {blog.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      blog.featured
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.featured ? "Published" : "Draft"}
                  </span>
                  <Link href={`/admin/blogs/edit/${blog.slug}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent blogs found
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link href="/admin/blogs">
            <Button variant="outline" className="w-full">
              View All Blogs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
