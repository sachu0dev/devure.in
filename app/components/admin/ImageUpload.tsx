"use client";
import { useState, useRef, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage, handleApiError } from "@/lib/api";
import Image from "next/image";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function ImageUpload({
  label,
  value,
  onChange,
  placeholder = "Click to upload image",
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when value prop changes (e.g., when editing existing blog)
  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    // Show temporary preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to S3
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadImage(formData);

      // Update preview to use S3 URL instead of base64
      setPreview(response.url);
      onChange(response.url);
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error uploading image:", errorMessage);
      alert(`Failed to upload image: ${errorMessage}`);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="space-y-3">
        {/* Upload Area */}
        <div
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            uploading
              ? "border-gray-300 bg-gray-50"
              : preview
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : preview ? (
            <div className="space-y-2">
              <div className="relative inline-block">
                <Image
                  src={preview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="h-20 w-20 object-cover rounded-lg mx-auto"
                  unoptimized={preview?.startsWith("https://")}
                  onError={(e) => {
                    console.error("Image failed to load:", preview);
                    // Fallback to a placeholder or show error state
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm text-green-600">
                Image uploaded successfully
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>

        {/* URL Display */}
        {value && (
          <div className="text-xs text-gray-500 break-all">
            <strong>URL:</strong> {value}
          </div>
        )}
      </div>
    </div>
  );
}
