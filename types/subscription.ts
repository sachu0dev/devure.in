export interface Subscription {
  _id: string;
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

export interface SubscriptionFormData {
  email: string;
  preferences?: {
    blogUpdates?: boolean;
    newsletter?: boolean;
    productUpdates?: boolean;
  };
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
}
