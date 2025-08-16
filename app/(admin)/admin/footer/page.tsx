"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAdminFooterContent,
  updateFooterContent,
  handleApiError,
} from "@/lib/api";
import { FooterContent } from "@/types/blog";

export default function FooterAdmin() {
  const [footer, setFooter] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadFooterContent();
  }, [router]);

  const loadFooterContent = async () => {
    try {
      setCreating(true);
      setError(null);
      const footerData = await getAdminFooterContent();
      setFooter(footerData);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading footer content:", errorMessage);
    } finally {
      setCreating(false);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!footer) return;

    try {
      setSaving(true);
      setError(null);
      await updateFooterContent(footer);
      setError(null);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error saving footer content:", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addQuickLink = () => {
    if (!footer) return;
    const newLink = {
      name: "",
      url: "",
      order: footer.quickLinks.length,
    };
    setFooter({
      ...footer,
      quickLinks: [...footer.quickLinks, newLink],
    });
  };

  const removeQuickLink = (index: number) => {
    if (!footer) return;
    const newLinks = footer.quickLinks.filter((_, i) => i !== index);
    const reorderedLinks = newLinks.map((link, i) => ({ ...link, order: i }));
    setFooter({
      ...footer,
      quickLinks: reorderedLinks,
    });
  };

  const updateQuickLink = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    if (!footer) return;
    const newLinks = [...footer.quickLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooter({ ...footer, quickLinks: newLinks });
  };

  const moveQuickLink = (index: number, direction: "up" | "down") => {
    if (!footer) return;
    const newLinks = [...footer.quickLinks];
    if (direction === "up" && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [
        newLinks[index - 1],
        newLinks[index],
      ];
    } else if (direction === "down" && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [
        newLinks[index + 1],
        newLinks[index],
      ];
    }
    newLinks.forEach((link, i) => (link.order = i));
    setFooter({ ...footer, quickLinks: newLinks });
  };

  const addServicesLink = () => {
    if (!footer) return;
    const newLink = {
      name: "",
      url: "",
      order: footer.servicesLinks.length,
    };
    setFooter({
      ...footer,
      servicesLinks: [...footer.servicesLinks, newLink],
    });
  };

  const removeServicesLink = (index: number) => {
    if (!footer) return;
    const newLinks = footer.servicesLinks.filter((_, i) => i !== index);
    const reorderedLinks = newLinks.map((link, i) => ({ ...link, order: i }));
    setFooter({
      ...footer,
      servicesLinks: reorderedLinks,
    });
  };

  const updateServicesLink = (
    index: number,
    field: "name" | "url",
    value: string
  ) => {
    if (!footer) return;
    const newLinks = [...footer.servicesLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooter({ ...footer, servicesLinks: newLinks });
  };

  const moveServicesLink = (index: number, direction: "up" | "down") => {
    if (!footer) return;
    const newLinks = [...footer.servicesLinks];
    if (direction === "up" && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [
        newLinks[index - 1],
        newLinks[index],
      ];
    } else if (direction === "down" && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [
        newLinks[index + 1],
        newLinks[index],
      ];
    }
    newLinks.forEach((link, i) => (link.order = i));
    setFooter({ ...footer, servicesLinks: newLinks });
  };

  const addSocialLink = () => {
    if (!footer) return;
    const newLink = {
      name: "",
      url: "",
      icon: "",
      order: footer.socialLinks.length,
    };
    setFooter({
      ...footer,
      socialLinks: [...footer.socialLinks, newLink],
    });
  };

  const removeSocialLink = (index: number) => {
    if (!footer) return;
    const newLinks = footer.socialLinks.filter((_, i) => i !== index);
    const reorderedLinks = newLinks.map((link, i) => ({ ...link, order: i }));
    setFooter({
      ...footer,
      socialLinks: reorderedLinks,
    });
  };

  const updateSocialLink = (
    index: number,
    field: "name" | "url" | "icon",
    value: string
  ) => {
    if (!footer) return;
    const newLinks = [...footer.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFooter({ ...footer, socialLinks: newLinks });
  };

  const moveSocialLink = (index: number, direction: "up" | "down") => {
    if (!footer) return;
    const newLinks = [...footer.socialLinks];
    if (direction === "up" && index > 0) {
      [newLinks[index], newLinks[index - 1]] = [
        newLinks[index - 1],
        newLinks[index],
      ];
    } else if (direction === "down" && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [
        newLinks[index + 1],
        newLinks[index],
      ];
    }
    newLinks.forEach((link, i) => (link.order = i));
    setFooter({ ...footer, socialLinks: newLinks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading footer content...</div>
      </div>
    );
  }

  if (!footer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">
            No footer content found
          </div>
          <p className="text-gray-600 mb-4">
            Click the button below to create default footer content
          </p>
          <Button onClick={loadFooterContent} disabled={creating}>
            {creating ? "Creating..." : "Create Default Content"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Section</h1>
          <p className="text-gray-600">Manage your footer content and links</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Main Content Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Brand Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Brand Title</Label>
                <Input
                  id="title"
                  value={footer.title}
                  onChange={(e) =>
                    setFooter({ ...footer, title: e.target.value })
                  }
                  placeholder="e.g., Devure.in"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={footer.description}
                  onChange={(e) =>
                    setFooter({ ...footer, description: e.target.value })
                  }
                  placeholder="Enter your footer description..."
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={footer.isActive}
                  onCheckedChange={(checked) =>
                    setFooter({ ...footer, isActive: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quick Links</CardTitle>
                <Button onClick={addQuickLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {footer.quickLinks.map((link, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Link {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveQuickLink(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveQuickLink(index, "down")}
                        disabled={index === footer.quickLinks.length - 1}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeQuickLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Link Name</Label>
                    <Input
                      value={link.name}
                      onChange={(e) =>
                        updateQuickLink(index, "name", e.target.value)
                      }
                      placeholder="e.g., Home, About, Contact"
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateQuickLink(index, "url", e.target.value)
                      }
                      placeholder="/about or https://example.com"
                    />
                  </div>
                </div>
              ))}
              {footer.quickLinks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No quick links added yet. Click Add Link to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Services and Social Links */}
        <div className="space-y-6">
          {/* Services Links Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Services Links</CardTitle>
                <Button onClick={addServicesLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {footer.servicesLinks.map((link, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Service Link {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveServicesLink(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveServicesLink(index, "down")}
                        disabled={index === footer.servicesLinks.length - 1}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeServicesLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Service Name</Label>
                    <Input
                      value={link.name}
                      onChange={(e) =>
                        updateServicesLink(index, "name", e.target.value)
                      }
                      placeholder="e.g., Web Applications, SaaS Platforms"
                    />
                  </div>
                  <div>
                    <Label>Service URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateServicesLink(index, "url", e.target.value)
                      }
                      placeholder="/service/web-applications"
                    />
                  </div>
                </div>
              ))}
              {footer.servicesLinks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No services links added yet. Click Add Link to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Links Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social Links</CardTitle>
                <Button onClick={addSocialLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {footer.socialLinks.map((link, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Social Link {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveSocialLink(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveSocialLink(index, "down")}
                        disabled={index === footer.socialLinks.length - 1}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeSocialLink(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Platform Name</Label>
                    <Input
                      value={link.name}
                      onChange={(e) =>
                        updateSocialLink(index, "name", e.target.value)
                      }
                      placeholder="e.g., GitHub, LinkedIn, Twitter"
                    />
                  </div>
                  <div>
                    <Label>Icon Name</Label>
                    <Input
                      value={link.icon}
                      onChange={(e) =>
                        updateSocialLink(index, "icon", e.target.value)
                      }
                      placeholder="e.g., Github, Linkedin, Twitter"
                    />
                  </div>
                  <div>
                    <Label>Profile URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        updateSocialLink(index, "url", e.target.value)
                      }
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              ))}
              {footer.socialLinks.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No social links added yet. Click Add Link to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
