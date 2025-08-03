"use client";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage, handleApiError } from "@/lib/api";
import Image from "next/image";

interface InlineImageUploadProps {
  onImageUploaded: (url: string) => void;
  onCancel: () => void;
}

export function InlineImageUpload({
  onImageUploaded,
  onCancel,
}: InlineImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onImageUploaded(response.url);
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Error uploading image:", errorMessage);
      alert(`Failed to upload image: ${errorMessage}`);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Upload Image</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="text-center space-y-2">
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className="h-32 w-32 object-cover rounded-lg mx-auto"
              unoptimized={preview?.startsWith("https://")}
              onError={(e) => {
                console.error("Image failed to load:", preview);
                // Fallback to a placeholder or show error state
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            <p className="text-sm text-green-600">
              Image uploaded successfully!
            </p>
            <p className="text-xs text-gray-500">
              Image will be inserted into the editor
            </p>
          </div>
        ) : (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Click to select image</p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
