import mongoose, { Schema, Document } from "mongoose";
import { BlogFrontmatter, Author } from "@/types/blog";

// Author Schema
const AuthorSchema = new Schema<Author>(
  {
    name: { type: String, required: true },
    profileUrl: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    social: {
      twitter: { type: String },
      linkedin: { type: String },
      github: { type: String },
    },
  },
  { _id: false }
);

// SEO Schema
const SEOSchema = new Schema(
  {
    keywords: [{ type: String }],
    canonical: { type: String },
    noindex: { type: Boolean, default: false },
  },
  { _id: false }
);

// Blog Frontmatter Schema
const BlogFrontmatterSchema = new Schema<BlogFrontmatter>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    category: { type: String, required: true },
    date: { type: String, required: true },
    coverImage: { type: String, required: true },
    ogImage: { type: String, required: true },
    author: { type: AuthorSchema, required: true },
    readTime: { type: String },
    featured: { type: Boolean, default: false },
    draft: { type: Boolean, default: true },
    publishedAt: { type: String },
    updatedAt: { type: String },
    seo: { type: SEOSchema },
  },
  { _id: false }
);

// Blog Document Interface
export interface IBlog extends Document {
  frontmatter: BlogFrontmatter;
  content: string;
  excerpt?: string;
  wordCount?: number;
  source: "s3";
  s3Key: string;
  s3Bucket: string;
  s3Region?: string;
  lastModified?: string;
  etag?: string;
  createdAt: Date;
  updatedAt: Date;
  toSummary(): {
    slug: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    date: string;
    coverImage: string;
    author: Author;
    readTime: string;
    featured: boolean;
    source: string;
    excerpt?: string;
    wordCount?: number;
  };
}

// Blog Schema
const BlogSchema = new Schema<IBlog>(
  {
    frontmatter: { type: BlogFrontmatterSchema, required: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    wordCount: { type: Number },
    source: { type: String, default: "s3", enum: ["s3"] },
    s3Key: { type: String, required: true },
    s3Bucket: { type: String, required: true },
    s3Region: { type: String },
    lastModified: { type: String },
    etag: { type: String },
  },
  {
    timestamps: true,
    collection: "blogs",
  }
);

// Indexes for better query performance
BlogSchema.index({ "frontmatter.slug": 1 }, { unique: true });
BlogSchema.index({ "frontmatter.category": 1 });
BlogSchema.index({ "frontmatter.tags": 1 });
BlogSchema.index({ "frontmatter.featured": 1 });
BlogSchema.index({ "frontmatter.draft": 1 });
BlogSchema.index({ "frontmatter.date": -1 });
BlogSchema.index({ "frontmatter.author.name": 1 });
BlogSchema.index({ createdAt: -1 });
BlogSchema.index({ updatedAt: -1 });

// Text search index
BlogSchema.index({
  "frontmatter.title": "text",
  "frontmatter.description": "text",
  "frontmatter.tags": "text",
  content: "text",
});

// Virtual for URL
BlogSchema.virtual("url").get(function () {
  return `/blog/${this.frontmatter.slug}`;
});

// Pre-save middleware to update timestamps
BlogSchema.pre("save", function (next) {
  if (this.isModified("frontmatter") || this.isModified("content")) {
    this.frontmatter.updatedAt = new Date().toISOString();
  }
  next();
});

// Static method to find published blogs
BlogSchema.statics.findPublished = function () {
  return this.find({ "frontmatter.draft": false });
};

// Static method to find featured blogs
BlogSchema.statics.findFeatured = function () {
  return this.find({
    "frontmatter.featured": true,
    "frontmatter.draft": false,
  });
};

// Static method to find by category
BlogSchema.statics.findByCategory = function (category: string) {
  return this.find({
    "frontmatter.category": category,
    "frontmatter.draft": false,
  });
};

// Static method to find by tag
BlogSchema.statics.findByTag = function (tag: string) {
  return this.find({ "frontmatter.tags": tag, "frontmatter.draft": false });
};

// Static method to search blogs
BlogSchema.statics.search = function (query: string) {
  return this.find(
    {
      $text: { $search: query },
      "frontmatter.draft": false,
    },
    {
      score: { $meta: "textScore" },
    }
  ).sort({ score: { $meta: "textScore" } });
};

// Instance method to get summary
BlogSchema.methods.toSummary = function () {
  // Safely extract author data to avoid circular references
  const author = this.frontmatter.author
    ? {
        name: this.frontmatter.author.name || "Unknown Author",
        profileUrl: this.frontmatter.author.profileUrl || "/authors/unknown",
      }
    : {
        name: "Unknown Author",
        profileUrl: "/authors/unknown",
      };

  return {
    slug: this.frontmatter.slug || "",
    title: this.frontmatter.title || "",
    description: this.frontmatter.description || "",
    category: this.frontmatter.category || "",
    tags: Array.isArray(this.frontmatter.tags) ? this.frontmatter.tags : [],
    date: this.frontmatter.date || new Date().toISOString(),
    coverImage: this.frontmatter.coverImage || "",
    author,
    readTime: this.frontmatter.readTime || "5 min read",
    featured: Boolean(this.frontmatter.featured),
    source: this.source || "s3",
    excerpt: this.excerpt || "",
    wordCount: this.wordCount || 0,
  };
};

// Check if model already exists to prevent overwrite
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;
