"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBlog, handleApiError } from "@/lib/api";
import { BlogFrontmatter } from "@/types/blog";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

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

export default function CreateBlog() {
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
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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
      const frontmatter: BlogFrontmatter = {
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
        date: new Date().toISOString(),
      };

      // Create blog via API
      await createBlog({
        frontmatter,
        content: formData.content,
        excerpt: formData.description.substring(0, 160) + "...",
      });

      // Redirect to blogs list
      router.push("/admin/blogs");
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error creating blog:", errorMessage);
      alert(`Failed to create blog: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Blog
            </h1>
            <p className="text-gray-600">
              Write your blog post and save as draft or publish directly
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Use &ldquo;Save Draft&rdquo; to save your work, or
              &ldquo;Publish&rdquo; to make it live immediately
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            variant="outline"
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
            <div className="space-y-6">
              <ImageUpload
                label="Cover Image"
                value={formData.coverImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: url,
                  }))
                }
                placeholder="Upload cover image for your blog post"
                required
              />
              <ImageUpload
                label="OG Image (Social Media)"
                value={formData.ogImage}
                onChange={(url) =>
                  setFormData((prev) => ({
                    ...prev,
                    ogImage: url,
                  }))
                }
                placeholder="Upload image for social media sharing"
              />
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
