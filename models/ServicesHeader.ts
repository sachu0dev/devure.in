import mongoose, { Schema, Document } from "mongoose";

// Services Header Document Interface
export interface IServicesHeader extends Document {
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Services Header Schema
const ServicesHeaderSchema = new Schema<IServicesHeader>(
  {
    mainTitle: { type: String, required: true, default: "Creating impact in" },
    services: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "services_header",
  }
);

// Indexes for better query performance
ServicesHeaderSchema.index({ isActive: 1 });

// Static method to find active header
ServicesHeaderSchema.statics.findActive = function () {
  return this.findOne({ isActive: true });
};

// Check if model already exists to prevent overwrite
const ServicesHeader =
  mongoose.models.ServicesHeader ||
  mongoose.model<IServicesHeader>("ServicesHeader", ServicesHeaderSchema);

export default ServicesHeader;
