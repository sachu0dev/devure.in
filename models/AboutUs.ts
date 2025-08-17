import mongoose, { Schema, Document } from "mongoose";

export interface IAboutUs extends Document {
  subtitle?: string;
  title: string;
  description: string;
  additionalDescription?: string;
  learnMoreButton: {
    text: string;
    url: string;
  };
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutUsSchema = new Schema<IAboutUs>(
  {
    subtitle: {
      type: String,
      required: false,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    additionalDescription: {
      type: String,
      required: false,
      trim: true,
    },
    learnMoreButton: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
      },
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AboutUs ||
  mongoose.model<IAboutUs>("AboutUs", AboutUsSchema);
