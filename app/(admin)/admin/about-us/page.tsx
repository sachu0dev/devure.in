"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, RefreshCw } from "lucide-react";
import { getAdminAboutUsContent, updateAboutUsContent } from "@/lib/api";
import { AboutUs } from "@/types";
import { toast } from "sonner";

export default function AboutUsAdminPage() {
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    learnMoreButton: {
      text: "",
      url: "",
    },
    imageUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadAboutUsContent();
  }, []);

  const loadAboutUsContent = async () => {
    try {
      setCreating(true);
      const content = await getAdminAboutUsContent();
      setAboutUs(content);
      setFormData({
        title: content.title,
        description: content.description,
        learnMoreButton: content.learnMoreButton,
        imageUrl: content.imageUrl,
        isActive: content.isActive,
      });
    } catch (error) {
      console.error("Error loading About Us content:", error);
      toast.error("Failed to load About Us content");
    } finally {
      setLoading(false);
      setCreating(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | { text: string; url: string }
  ) => {
    if (field === "learnMoreButton") {
      setFormData((prev) => ({
        ...prev,
        learnMoreButton: value as { text: string; url: string },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleLearnMoreButtonChange = (
    field: "text" | "url",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      learnMoreButton: {
        ...prev.learnMoreButton,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updatedContent = await updateAboutUsContent({
        ...aboutUs!,
        ...formData,
      });
      setAboutUs(updatedContent);
      toast.success("About Us content updated successfully!");
    } catch (error) {
      console.error("Error updating About Us content:", error);
      toast.error("Failed to update About Us content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Us Content</h1>
          <p className="text-gray-600 mt-2">
            Manage the About Us section content for the landing page
          </p>
        </div>
        <Button
          onClick={loadAboutUsContent}
          variant="outline"
          disabled={creating}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {creating ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Us Section</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter the title for the About Us section"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter the description for the About Us section"
                rows={4}
                required
              />
            </div>

            {/* Learn More Button */}
            <div className="space-y-4">
              <Label>Learn More Button</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={formData.learnMoreButton.text}
                    onChange={(e) =>
                      handleLearnMoreButtonChange("text", e.target.value)
                    }
                    placeholder="e.g., Learn More"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buttonUrl">Button URL</Label>
                  <Input
                    id="buttonUrl"
                    value={formData.learnMoreButton.url}
                    onChange={(e) =>
                      handleLearnMoreButtonChange("url", e.target.value)
                    }
                    placeholder="e.g., /about"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="Enter the URL for the About Us image"
                required
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange("isActive", checked)
                }
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
