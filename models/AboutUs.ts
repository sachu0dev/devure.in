import mongoose, { Schema, Document } from "mongoose";

export interface IAboutUs extends Document {
  title: string;
  description: string;
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
