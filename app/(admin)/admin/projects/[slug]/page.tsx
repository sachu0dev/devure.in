"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAdminProject, updateProject, handleApiError } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ProjectFormData {
  category: string;
  title: string;
  slug: string;
  coverImage: string;
  content: string;
  excerpt: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

export default function EditProject() {
  const [formData, setFormData] = useState<ProjectFormData>({
    category: "",
    title: "",
    slug: "",
    coverImage: "",
    content: "",
    excerpt: "",
    isActive: true,
    isFeatured: false,
    order: 0,
    metaTitle: "",
    metaDescription: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params.slug) {
      loadProject(params.slug as string);
    }
  }, [params.slug]);

  const loadProject = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);

      const project = await getAdminProject(slug);

      setFormData({
        category: project.category,
        title: project.title,
        slug: project.slug,
        coverImage: project.coverImage,
        content: project.content,
        excerpt: project.excerpt || "",
        isActive: project.isActive,
        isFeatured: project.isFeatured,
        order: project.order,
        metaTitle: project.metaTitle || "",
        metaDescription: project.metaDescription || "",
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading project:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      setError(null);

      // Update project via API
      await updateProject(params.slug as string, {
        ...formData,
        excerpt: formData.excerpt || formData.content.substring(0, 160) + "...",
      });

      // Redirect to projects list
      router.push("/admin/projects");
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error updating project:", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const projectCategories = [
    "Web Development",
    "Mobile App",
    "Desktop App",
    "SaaS Platform",
    "E-commerce",
    "Portfolio",
    "Blog/CMS",
    "API Platform",
    "Dashboard",
    "Game",
    "Social Platform",
    "Marketplace",
    "Analytics Tool",
    "Productivity Tool",
    "Educational Platform",
    "Healthcare App",
    "Finance App",
    "Entertainment",
    "Utility Tool",
    "Other",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading project...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link href="/admin/projects">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Project: {formData.title}
            </h1>
            <p className="text-gray-600">
              Update your project content and settings
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select project category</option>
              {projectCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter project title"
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
              placeholder="project-slug"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  excerpt: e.target.value,
                }))
              }
              placeholder="Brief description of your project"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to auto-generate from content
            </p>
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
          {/* Status & Featured */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status & Settings
            </h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Active project
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured project
                </span>
              </label>
            </div>
          </div>

          {/* Order */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order</h3>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Project Cover Image */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Project Cover Image
            </h3>
            <ImageUpload
              label=""
              value={formData.coverImage}
              onChange={(url) =>
                setFormData((prev) => ({
                  ...prev,
                  coverImage: url,
                }))
              }
              placeholder="Upload image for your project"
              required
            />
          </div>

          {/* SEO */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaTitle: e.target.value,
                    }))
                  }
                  placeholder="SEO title for search engines"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metaDescription: e.target.value,
                    }))
                  }
                  placeholder="SEO description for search engines"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
