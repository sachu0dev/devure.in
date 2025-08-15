import mongoose, { Schema, Document } from "mongoose";

// Service Document Interface
export interface IService extends Document {
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  excerpt?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service Schema
const ServiceSchema = new Schema<IService>(
  {
    serviceType: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  {
    timestamps: true,
    collection: "services",
  }
);

// Indexes for better query performance
ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ serviceType: 1 });
ServiceSchema.index({ isActive: 1 });
ServiceSchema.index({ isFeatured: 1 });
ServiceSchema.index({ order: 1 });
ServiceSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug if not provided
ServiceSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Static method to find active services
ServiceSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
};

// Static method to find featured services
ServiceSchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, isActive: true }).sort({ order: 1, createdAt: -1 });
};

// Static method to find by service type
ServiceSchema.statics.findByType = function (serviceType: string) {
  return this.find({ serviceType, isActive: true }).sort({ order: 1, createdAt: -1 });
};

// Check if model already exists to prevent overwrite
const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
