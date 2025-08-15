import mongoose, { Schema, Document } from "mongoose";

// Image Schema for the slider
const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

// Link Schema for social/portfolio links
const LinkSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

// Hero Document Interface
export interface IHero extends Document {
  title1: string;
  title2: string;
  description: string;
  images: Array<{
    url: string;
    alt: string;
    order: number;
  }>;
  links: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  showOnHome: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Hero Schema
const HeroSchema = new Schema<IHero>(
  {
    title1: { type: String, required: true, default: "GENUINE." },
    title2: { type: String, required: true, default: "IMPACT." },
    description: {
      type: String,
      required: true,
      default:
        "At Devure, we help businesses build, launch, and scale custom web applications — blending design, development, and technical expertise to deliver solutions that work and grow with you.",
    },
    images: [ImageSchema],
    links: [LinkSchema],
    showOnHome: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "hero",
  }
);

// Indexes for better query performance
HeroSchema.index({ showOnHome: 1 });
HeroSchema.index({ isActive: 1 });
HeroSchema.index({ createdAt: -1 });
HeroSchema.index({ updatedAt: -1 });

// Static method to find active hero content
HeroSchema.statics.findActive = function () {
  return this.findOne({ isActive: true });
};

// Static method to find hero content for home page
HeroSchema.statics.findForHome = function () {
  return this.findOne({ showOnHome: true, isActive: true });
};

// Check if model already exists to prevent overwrite
const Hero = mongoose.models.Hero || mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;
