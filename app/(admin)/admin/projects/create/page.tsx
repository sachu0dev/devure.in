"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProject, handleApiError } from "@/lib/api";
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
  liveUrl: string;
  githubUrl: string;
  client: string;
  duration: string;
  technologies: string[];
  tags: string[];
  description: string;
}

export default function CreateProject() {
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
    liveUrl: "",
    githubUrl: "",
    client: "",
    duration: "",
    technologies: [],
    tags: [],
    description: "",
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
      // Create project via API
      await createProject({
        ...formData,
        isActive: publish, // If publishing, set as active
        excerpt: formData.excerpt || formData.content.substring(0, 160) + "...",
      });

      // Redirect to projects list
      router.push("/admin/projects");
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error creating project:", errorMessage);
      alert(`Failed to create project: ${errorMessage}`);
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
              Create New Project
            </h1>
            <p className="text-gray-600">
              Create a new project with rich content and MDX support
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of your project"
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              A comprehensive overview of the project
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

          {/* Project URLs */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Project URLs
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live URL
                </label>
                <Input
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      liveUrl: e.target.value,
                    }))
                  }
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to the live project
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository
                </label>
                <Input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      githubUrl: e.target.value,
                    }))
                  }
                  placeholder="https://github.com/username/repo"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to the source code
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Project Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client
                </label>
                <Input
                  value={formData.client}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      client: e.target.value,
                    }))
                  }
                  placeholder="Client name or company"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g., 3 months, 6 weeks"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies
                </label>
                <Input
                  value={formData.technologies.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technologies: e.target.value
                        .split(",")
                        .map((tech) => tech.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="React, Node.js, MongoDB (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple technologies with commas
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <Input
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    }))
                  }
                  placeholder="web-app, responsive, modern (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate multiple tags with commas
                </p>
              </div>
            </div>
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
