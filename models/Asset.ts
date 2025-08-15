import mongoose, { Schema, Document } from "mongoose";

// Asset Document Interface
export interface IAsset extends Document {
  name: string;
  url: string;
  s3Key: string;
  s3Bucket: string;
  s3Region?: string;
  alt: string;
  description?: string;
  tags: string[];
  category: string;
  fileSize: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  isPublic: boolean;
  uploadedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Asset Schema
const AssetSchema = new Schema<IAsset>(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    s3Key: { type: String, required: true },
    s3Bucket: { type: String, required: true },
    s3Region: { type: String },
    alt: { type: String, required: true },
    description: { type: String },
    tags: [{ type: String }],
    category: { type: String, required: true, default: "general" },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    dimensions: {
      width: { type: Number },
      height: { type: Number },
    },
    isPublic: { type: Boolean, default: true },
    uploadedBy: { type: String },
  },
  {
    timestamps: true,
    collection: "assets",
  }
);

// Indexes for better query performance
AssetSchema.index({
  name: "text",
  alt: "text",
  description: "text",
  tags: "text",
});
AssetSchema.index({ category: 1 });
AssetSchema.index({ tags: 1 });
AssetSchema.index({ isPublic: 1 });
AssetSchema.index({ createdAt: -1 });
AssetSchema.index({ uploadedBy: 1 });

// Virtual for file extension
AssetSchema.virtual("fileExtension").get(function () {
  return this.mimeType.split("/")[1] || "unknown";
});

// Virtual for formatted file size
AssetSchema.virtual("formattedFileSize").get(function () {
  if (this.fileSize < 1024) return `${this.fileSize} B`;
  if (this.fileSize < 1024 * 1024)
    return `${(this.fileSize / 1024).toFixed(1)} KB`;
  if (this.fileSize < 1024 * 1024 * 1024)
    return `${(this.fileSize / (1024 * 1024)).toFixed(1)} MB`;
  return `${(this.fileSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
});

// Static method to find public assets
AssetSchema.statics.findPublic = function () {
  return this.find({ isPublic: true });
};

// Static method to find by category
AssetSchema.statics.findByCategory = function (category: string) {
  return this.find({ category, isPublic: true });
};

// Static method to find by tags
AssetSchema.statics.findByTags = function (tags: string[]) {
  return this.find({ tags: { $in: tags }, isPublic: true });
};

// Static method to search assets
AssetSchema.statics.search = function (query: string) {
  return this.find(
    {
      $text: { $search: query },
      isPublic: true,
    },
    {
      score: { $meta: "textScore" },
    }
  ).sort({ score: { $meta: "textScore" } });
};

// Check if model already exists to prevent overwrite
const Asset =
  mongoose.models.Asset || mongoose.model<IAsset>("Asset", AssetSchema);

export default Asset;
