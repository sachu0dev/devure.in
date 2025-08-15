import dbConnect from "./mongodb";
import Service from "@/models/Service";
import ServicesHeader from "@/models/ServicesHeader";

interface ServiceData {
  _id: string;
  serviceType: string;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface ServicesHeaderData {
  _id: string;
  mainTitle: string;
  services: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// SERVER-SIDE FUNCTIONS (MongoDB - Direct Access)
// =============================================================================

/**
 * Get all active services from MongoDB (for sitemap and static generation)
 */
export async function getAllServices(): Promise<ServiceData[]> {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true })
      .select(
        "serviceType title slug image excerpt content isActive isFeatured order createdAt updatedAt"
      )
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Serialize the data to remove MongoDB ObjectId and Date objects
    return services.map((service: Record<string, unknown>) => ({
      ...service,
      _id: (service._id as { toString(): string }).toString(),
      createdAt: (service.createdAt as { toISOString(): string }).toISOString(),
      updatedAt: (service.updatedAt as { toISOString(): string }).toISOString(),
    })) as ServiceData[];
  } catch (error) {
    console.error("Error fetching services from database:", error);
    return [];
  }
}

/**
 * Get services header from MongoDB (for static generation)
 */
export async function getServicesHeader(): Promise<ServicesHeaderData | null> {
  try {
    await dbConnect();
    const header = await ServicesHeader.findOne({ isActive: true }).lean();

    if (!header) return null;

    // Serialize the data to remove MongoDB ObjectId and Date objects
    const serializedHeader = {
      ...header,
      _id: (header as Record<string, unknown>)._id?.toString() || "",
      createdAt:
        (
          (header as Record<string, unknown>).createdAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
      updatedAt:
        (
          (header as Record<string, unknown>).updatedAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
    };

    return serializedHeader as unknown as ServicesHeaderData;
  } catch (error) {
    console.error("Error fetching services header from database:", error);
    return null;
  }
}

/**
 * Get a service by slug from MongoDB (for static generation)
 */
export async function getServiceBySlug(slug: string) {
  try {
    await dbConnect();
    const service = await Service.findOne({ slug, isActive: true }).lean();

    if (!service) return null;

    // Serialize the data to remove MongoDB ObjectId and Date objects
    const serializedService = {
      ...service,
      _id: (service as Record<string, unknown>)._id?.toString() || "",
      createdAt:
        (
          (service as Record<string, unknown>).createdAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
      updatedAt:
        (
          (service as Record<string, unknown>).updatedAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
    };

    return serializedService as unknown as ServiceData;
  } catch (error) {
    console.error("Error fetching service from database:", error);
    return null;
  }
}
