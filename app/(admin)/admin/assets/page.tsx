"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Upload, Trash2, Copy, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAssets,
  deleteAsset,
  updateAsset,
  handleApiError,
  uploadImage,
} from "@/lib/api";
import { Asset, AssetSearchOptions } from "@/types";
import Image from "next/image";

export default function AssetsAdmin() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: "",
    alt: "",
    description: "",
    tags: "",
    category: "general",
  });

  const router = useRouter();
  const observer = useRef<IntersectionObserver | null>(null);

  const loadAssets = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;
        const options: AssetSearchOptions = {
          page: currentPage,
          limit: 20,
          search: searchTerm,
          category: category || undefined,
        };

        const response = await getAssets(options);

        if (reset) {
          setAssets(response.assets);
          setPage(1);
        } else {
          setAssets((prev) => [...prev, ...response.assets]);
        }

        setHasMore(response.pagination.hasNext);
        setPage(currentPage + 1);
      } catch (error) {
        const errorMessage = handleApiError(error);
        setError(errorMessage);
        console.error("Error loading assets:", errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [page, searchTerm, category]
  );

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/admin/login");
      return;
    }

    loadAssets(true);
  }, [router, loadAssets]);

  const handleSearch = useCallback(() => {
    loadAssets(true);
  }, [loadAssets]);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      // Upload to S3
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await uploadImage(formData);

      // Update asset with form data if provided
      if (
        uploadForm.name ||
        uploadForm.alt ||
        uploadForm.description ||
        uploadForm.tags ||
        uploadForm.category !== "general"
      ) {
        const assetData = {
          name: uploadForm.name || file.name,
          alt: uploadForm.alt || file.name,
          description: uploadForm.description,
          tags: uploadForm.tags
            ? uploadForm.tags.split(",").map((tag) => tag.trim())
            : [],
          category: uploadForm.category,
        };

        const updatedAsset = await updateAsset(
          uploadResponse.assetId,
          assetData
        );

        // Add to assets list
        setAssets((prev) => [updatedAsset, ...prev]);
      } else {
        // Use the asset created by upload API
        setAssets((prev) => [uploadResponse.asset, ...prev]);
      }

      // Reset form
      setUploadForm({
        name: "",
        alt: "",
        description: "",
        tags: "",
        category: "general",
      });
      setShowUpload(false);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error uploading asset:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    try {
      await deleteAsset(assetId);
      setAssets((prev) => prev.filter((asset) => asset._id !== assetId));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error("Error deleting asset:", errorMessage);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You can add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  // Intersection Observer for infinite scroll
  const lastAssetElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadAssets(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadAssets]
  );

  const categories = [
    "general",
    "hero",
    "blog",
    "portfolio",
    "gallery",
    "icons",
    "logos",
    "backgrounds",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assets</h1>
          <p className="text-gray-600">Manage your website images and files</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Asset
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Asset</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="upload-name">Name</Label>
                <Input
                  id="upload-name"
                  value={uploadForm.name}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Asset name"
                />
              </div>
              <div>
                <Label htmlFor="upload-alt">Alt Text</Label>
                <Input
                  id="upload-alt"
                  value={uploadForm.alt}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, alt: e.target.value }))
                  }
                  placeholder="Alternative text for accessibility"
                />
              </div>
              <div>
                <Label htmlFor="upload-description">Description</Label>
                <Input
                  id="upload-description"
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Asset description"
                />
              </div>
              <div>
                <Label htmlFor="upload-tags">Tags (comma-separated)</Label>
                <Input
                  id="upload-tags"
                  value={uploadForm.tags}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div>
                <Label htmlFor="upload-category">Category</Label>
                <select
                  id="upload-category"
                  value={uploadForm.category}
                  onChange={(e) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="upload-file">File</Label>
                <Input
                  id="upload-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUpload(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {assets.map((asset, index) => (
          <div
            key={asset._id}
            ref={index === assets.length - 1 ? lastAssetElementRef : null}
            className="group relative"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={asset.url}
                    alt={asset.alt || asset.originalName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />

                  {/* Delete button on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleDelete(asset._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="p-3">
                  <h3
                    className="font-medium text-sm truncate"
                    title={asset.name}
                  >
                    {asset.name}
                  </h3>

                  {/* URL with copy button */}
                  <div className="flex items-center gap-2 mt-2">
                    <Input value={asset.url} readOnly className="text-xs h-8" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(asset.url)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Asset details */}
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <div>
                      Size:{" "}
                      {asset.fileSize < 1024 * 1024
                        ? `${(asset.fileSize / 1024).toFixed(1)} KB`
                        : `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB`}
                    </div>
                    <div>Category: {asset.category}</div>
                    {asset.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {asset.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {asset.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            +{asset.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading assets...</div>
        </div>
      )}

      {/* No assets message */}
      {!loading && assets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No assets found</div>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Your First Asset
          </Button>
        </div>
      )}
    </div>
  );
}
