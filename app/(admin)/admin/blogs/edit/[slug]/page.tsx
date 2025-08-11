"use client";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminBlogBySlug, handleApiError, updateBlog } from "@/lib/api";
import { BlogFrontmatter } from "@/types/blog";
import { ArrowLeft, Eye, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  coverImage: string;
  ogImage: string;
  authorName: string;
  authorProfileUrl: string;
  readTime: string;
  featured: boolean;
  content: string;
}

export default function EditBlog() {
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    description: "",
    category: "",
    tags: "",
    coverImage: "",
    ogImage: "",
    authorName: "Devure Team",
    authorProfileUrl: "/authors/devure-team",
    readTime: "5 min read",
    featured: false,
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const loadBlog = useCallback(async () => {
    try {
      const blog = await getAdminBlogBySlug(slug);

      // Populate form data
      setFormData({
        title: blog.frontmatter.title,
        slug: blog.frontmatter.slug,
        description: blog.frontmatter.description,
        category: blog.frontmatter.category,
        tags: blog.frontmatter.tags.join(", "),
        coverImage: blog.frontmatter.coverImage,
        ogImage: blog.frontmatter.ogImage,
        authorName: blog.frontmatter.author.name,
        authorProfileUrl: blog.frontmatter.author.profileUrl,
        readTime: blog.frontmatter.readTime || "5 min read",
        featured: blog.frontmatter.featured || false,
        content: blog.content,
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error loading blog:", errorMessage);
      alert(`Failed to load blog: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadBlog();
  }, [router, loadBlog]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);

    try {
      // Prepare frontmatter data
      const frontmatter: Partial<BlogFrontmatter> = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        coverImage: formData.coverImage,
        ogImage: formData.ogImage,
        author: {
          name: formData.authorName,
          profileUrl: formData.authorProfileUrl,
        },
        readTime: formData.readTime,
        featured: formData.featured,
        draft: !publish, // Draft is false when publishing, true when saving
      };

      // Update blog via API
      await updateBlog(slug, {
        frontmatter,
        content: formData.content,
        excerpt: formData.description.substring(0, 160) + "...",
      });

      // Redirect to blogs list
      router.push("/admin/blogs");
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error updating blog:", errorMessage);
      alert(`Failed to update blog: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
            <p className="text-gray-600">
              Update your blog post and save as draft or publish
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Use &ldquo;Save Draft&rdquo; to save your work, or
              &ldquo;Publish&rdquo; to make it live immediately
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              required
              className="text-lg"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="blog-post-slug"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of your blog post"
              rows={3}
              required
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <BlogEditor
              content={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Status */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Featured Status
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      featured: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured post
                </span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="fullstack">Fullstack</option>
              <option value="devops">DevOps</option>
              <option value="mobile">Mobile</option>
              <option value="ai">AI/ML</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            <Input
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Images */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      coverImage: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OG Image URL
                </label>
                <Input
                  value={formData.ogImage}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ogImage: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/og-image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Author</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name
                </label>
                <Input
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      authorName: e.target.value,
                    }))
                  }
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Profile URL
                </label>
                <Input
                  value={formData.authorProfileUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      authorProfileUrl: e.target.value,
                    }))
                  }
                  placeholder="/authors/author-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <Input
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      readTime: e.target.value,
                    }))
                  }
                  placeholder="5 min read"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
