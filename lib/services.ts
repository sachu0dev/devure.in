import dbConnect from "./mongodb";
import Service from "@/models/Service";
import ServicesHeader from "@/models/ServicesHeader";

// =============================================================================
// SERVER-SIDE FUNCTIONS (MongoDB - Direct Access)
// =============================================================================

/**
 * Get all active services from MongoDB (for sitemap and static generation)
 */
export async function getAllServices() {
  try {
    await dbConnect();
    const services = await Service.find({ isActive: true })
      .select("slug updatedAt createdAt")
      .lean();
    return services;
  } catch (error) {
    console.error("Error fetching services from database:", error);
    return [];
  }
}

/**
 * Get services header from MongoDB (for static generation)
 */
export async function getServicesHeader() {
  try {
    await dbConnect();
    const header = await ServicesHeader.findOne({ isActive: true }).lean();
    return header;
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
    return service;
  } catch (error) {
    console.error("Error fetching service from database:", error);
    return null;
  }
}
