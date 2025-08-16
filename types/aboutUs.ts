export interface AboutUs {
  _id: string;
  title: string;
  description: string;
  learnMoreButton: {
    text: string;
    url: string;
  };
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AboutUsData {
  title: string;
  description: string;
  learnMoreButton: {
    text: string;
    url: string;
  };
  imageUrl: string;
  isActive: boolean;
}

export interface AboutUsFormData {
  title: string;
  description: string;
  learnMoreButton: {
    text: string;
    url: string;
  };
  imageUrl: string;
  isActive: boolean;
}

export interface AboutUsResponse {
  success: boolean;
  data: AboutUs;
  message: string;
}

export interface AboutUsError {
  type: AboutUsErrorType;
  message: string;
  field?: string;
}

export type AboutUsErrorType =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "UPDATE_FAILED"
  | "CREATE_FAILED"
  | "UNKNOWN_ERROR";

// Utility types
export type AboutUsWithoutId = Omit<AboutUs, "_id">;
export type AboutUsWithoutTimestamps = Omit<AboutUs, "createdAt" | "updatedAt">;
export type AboutUsCreateData = Omit<
  AboutUs,
  "_id" | "createdAt" | "updatedAt"
>;
export type AboutUsUpdateData = Partial<AboutUsCreateData>;
