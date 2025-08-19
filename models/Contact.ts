import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone?: string;
  website?: string;
  projectType: string;
  serviceType: string;
  budget: string;
  timeline: string;
  message: string;
  requestedCall: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Optional field
          // Basic phone validation - allows international formats
          return /^[\+]?[1-9][\d]{0,15}$/.test(v.replace(/[\s\-\(\)]/g, ""));
        },
        message: "Please enter a valid phone number",
      },
    },
    website: {
      type: String,
      trim: true,
      maxlength: [200, "Website URL cannot exceed 200 characters"],
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Optional field
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: "Please enter a valid website URL",
      },
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      enum: {
        values: ["new_project", "redesign", "maintenance", "consultation"],
        message: "Invalid project type",
      },
    },
    serviceType: {
      type: String,
      required: [true, "Service type is required"],
      enum: {
        values: [
          "web_app",
          "landing_page",
          "ecommerce",
          "mobile_app",
          "ui_ux",
          "api_integration",
          "seo",
        ],
        message: "Invalid service type",
      },
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
      trim: true,
      maxlength: [50, "Budget cannot exceed 50 characters"],
    },
    timeline: {
      type: String,
      required: [true, "Timeline is required"],
      trim: true,
      maxlength: [50, "Timeline cannot exceed 50 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    requestedCall: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ContactSchema.index({ email: 1, createdAt: -1 });
ContactSchema.index({ requestedCall: 1, createdAt: -1 });
ContactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
