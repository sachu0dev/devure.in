import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  lastEmailSent?: Date;
  preferences?: {
    blogUpdates: boolean;
    newsletter: boolean;
    productUpdates: boolean;
  };
}

const SubscriptionSchema = new Schema<ISubscription>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
  },
  preferences: {
    blogUpdates: {
      type: Boolean,
      default: true,
    },
    newsletter: {
      type: Boolean,
      default: true,
    },
    productUpdates: {
      type: Boolean,
      default: false,
    },
  },
});

// Index for efficient queries
SubscriptionSchema.index({ email: 1 });
SubscriptionSchema.index({ isActive: 1 });
SubscriptionSchema.index({ "preferences.blogUpdates": 1 });

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
