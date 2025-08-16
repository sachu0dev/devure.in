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
  getAdminHeroContent,
  updateHeroContent,
  handleApiError,
} from "@/lib/api";
import { Hero as HeroContent } from "@/types";

export default function HeroAdmin() {
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadHeroContent();
  }, [router]);

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const heroData = await getAdminHeroContent();
      setHero(heroData);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error loading hero content:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!hero) return;

    try {
      setSaving(true);
      setError(null);
      await updateHeroContent(hero);
      setError(null);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error saving hero content:", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (!hero) return;
    const newImage = {
      url: "",
      alt: "",
      order: hero.images.length,
    };
    setHero({
      ...hero,
      images: [...hero.images, newImage],
    });
  };

  const removeImage = (index: number) => {
    if (!hero) return;
    const newImages = hero.images.filter((_, i) => i !== index);
    // Reorder remaining images
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    setHero({
      ...hero,
      images: reorderedImages,
    });
  };

  const updateImage = (index: number, field: "url" | "alt", value: string) => {
    if (!hero) return;
    const newImages = [...hero.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setHero({ ...hero, images: newImages });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (!hero) return;
    const newImages = [...hero.images];
    if (direction === "up" && index > 0) {
      [newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
    }
    // Update order values
    newImages.forEach((img, i) => (img.order = i));
    setHero({ ...hero, images: newImages });
  };

  const addLink = () => {
    if (!hero) return;
    const newLink = {
      name: "",
      url: "",
      order: hero.links.length,
    };
    setHero({
      ...hero,
      links: [...hero.links, newLink],
    });
  };

  const removeLink = (index: number) => {
    if (!hero) return;
    const newLinks = hero.links.filter((_, i) => i !== index);
    // Reorder remaining links
    const reorderedLinks = newLinks.map((link, i) => ({ ...link, order: i }));
    setHero({
      ...hero,
      links: reorderedLinks,
    });
  };

  const updateLink = (index: number, field: "name" | "url", value: string) => {
    if (!hero) return;
    const newLinks = [...hero.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setHero({ ...hero, links: newLinks });
  };

  const moveLink = (index: number, direction: "up" | "down") => {
    if (!hero) return;
    const newLinks = [...hero.links];
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
    // Update order values
    newLinks.forEach((link, i) => (link.order = i));
    setHero({ ...hero, links: newLinks });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading hero content...</div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">No hero content found</div>
          <p className="text-gray-600 mb-4">
            Click the button below to create default hero content
          </p>
          <Button onClick={loadHeroContent}>Create Default Content</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
          <p className="text-gray-600">Manage your hero section content</p>
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
        {/* Left Column - Text Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title1">Title 1</Label>
                <Input
                  id="title1"
                  value={hero.title1}
                  onChange={(e) => setHero({ ...hero, title1: e.target.value })}
                  placeholder="e.g., GENUINE."
                />
              </div>
              <div>
                <Label htmlFor="title2">Title 2</Label>
                <Input
                  id="title2"
                  value={hero.title2}
                  onChange={(e) => setHero({ ...hero, title2: e.target.value })}
                  placeholder="e.g., IMPACT."
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={hero.description}
                  onChange={(e) =>
                    setHero({ ...hero, description: e.target.value })
                  }
                  placeholder="Enter your hero description..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showOnHome">Show on Home Page</Label>
                <Switch
                  id="showOnHome"
                  checked={hero.showOnHome}
                  onCheckedChange={(checked) =>
                    setHero({ ...hero, showOnHome: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={hero.isActive}
                  onCheckedChange={(checked) =>
                    setHero({ ...hero, isActive: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Images and Links */}
        <div className="space-y-6">
          {/* Images Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Image Slider</CardTitle>
                <Button onClick={addImage} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hero.images.map((image, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Image {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveImage(index, "down")}
                        disabled={index === hero.images.length - 1}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={image.url}
                      onChange={(e) =>
                        updateImage(index, "url", e.target.value)
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label>Alt Text</Label>
                    <Input
                      value={image.alt}
                      onChange={(e) =>
                        updateImage(index, "alt", e.target.value)
                      }
                      placeholder="Description of the image"
                    />
                  </div>
                </div>
              ))}
              {hero.images.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No images added yet. Click Add Image to get started.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social/Portfolio Links</CardTitle>
                <Button onClick={addLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {hero.links.map((link, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Link {index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveLink(index, "up")}
                        disabled={index === 0}
                      >
                        <MoveUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => moveLink(index, "down")}
                        disabled={index === hero.links.length - 1}
                      >
                        <MoveDown className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeLink(index)}
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
                        updateLink(index, "name", e.target.value)
                      }
                      placeholder="e.g., Portfolio, GitHub, Twitter"
                    />
                  </div>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(index, "url", e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              ))}
              {hero.links.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No links added yet. Click Add Link to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
