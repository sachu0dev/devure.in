"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createService, handleApiError } from "@/lib/api";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface ServiceFormData {
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle: string;
  metaDescription: string;
}

export default function CreateService() {
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceType: "",
    title: "",
    slug: "",
    image: "",
    content: "",
    excerpt: "",
    isActive: true,
    isFeatured: false,
    order: 0,
    metaTitle: "",
    metaDescription: "",
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
      // Create service via API
      await createService({
        ...formData,
        isActive: publish, // If publishing, set as active
        excerpt: formData.excerpt || formData.content.substring(0, 160) + "...",
      });

      // Redirect to services list
      router.push("/admin/services");
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error creating service:", errorMessage);
      alert(`Failed to create service: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const serviceTypes = [
    "Web Development",
    "SaaS Platforms",
    "Productivity Tools",
    "Analytics",
    "Social Platforms",
    "Project Management",
    "API Platforms",
    "Portfolio",
    "E-commerce",
    "CRM",
    "Chat Apps",
    "Blog/CMS",
    "Marketplace",
    "Mobile Apps",
    "Desktop Apps",
    "Cloud Services",
    "DevOps",
    "Security",
    "AI/ML",
    "Blockchain",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/services">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Service
            </h1>
            <p className="text-gray-600">
              Create a new service with rich content and MDX support
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
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type *
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  serviceType: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select service type</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
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
              placeholder="Enter service title"
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
              placeholder="service-slug"
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
              placeholder="Brief description of your service"
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
                  Active service
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
                  Featured service
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

          {/* Service Image */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Service Image
            </h3>
            <ImageUpload
              label=""
              value={formData.image}
              onChange={(url) =>
                setFormData((prev) => ({
                  ...prev,
                  image: url,
                }))
              }
              placeholder="Upload image for your service"
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
