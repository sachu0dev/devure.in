import mongoose, { Schema, Document } from "mongoose";

// Project Document Interface
export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  images: string[];
  tags: string[];
  category: string;
  client?: string;
  duration?: string;
  technologies: string[];
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project Schema
const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    coverImage: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: String }],
    category: { type: String, required: true },
    client: { type: String },
    duration: { type: String },
    technologies: [{ type: String }],
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    metaTitle: { type: String },
    metaDescription: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

// Indexes for better query performance
ProjectSchema.index({ slug: 1 }, { unique: true });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ order: 1 });

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
