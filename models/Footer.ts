import mongoose, { Schema, Document } from "mongoose";

export interface IFooter extends Document {
  title: string;
  description: string;
  quickLinks: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  servicesLinks: Array<{
    name: string;
    url: string;
    order: number;
  }>;
  socialLinks: Array<{
    name: string;
    url: string;
    icon: string;
    order: number;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FooterSchema = new Schema<IFooter>(
  {
    title: {
      type: String,
      required: true,
      default: "Devure.in",
    },
    description: {
      type: String,
      required: true,
      default:
        "Building modern, scalable web applications with cutting-edge technologies. Let's turn your ideas into reality.",
    },
    quickLinks: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    servicesLinks: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    socialLinks: [
      {
        name: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Footer ||
  mongoose.model<IFooter>("Footer", FooterSchema);
