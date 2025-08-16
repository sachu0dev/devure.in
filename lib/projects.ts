import dbConnect from "./mongodb";
import Project from "@/models/Project";

// Import types from organized type files
import { ProjectData } from "@/types";

// Import types from organized type files
import { ProjectCategory, ProjectTag } from "@/types";

export async function getAllProjects(): Promise<ProjectData[]> {
  try {
    await dbConnect();
    const projects = await Project.find({ isActive: true })
      .select(
        "title slug description content excerpt coverImage images tags category client duration technologies isActive isFeatured order createdAt updatedAt"
      )
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Serialize the data to remove MongoDB ObjectId and Date objects
    return projects.map((project: Record<string, unknown>) => ({
      ...project,
      _id: (project._id as { toString(): string })?.toString() || "",
      createdAt:
        (project.createdAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        (project.updatedAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
    })) as ProjectData[];
  } catch (error) {
    console.error("Error fetching projects from database:", error);
    return [];
  }
}

/**
 * Get featured projects from MongoDB
 */
export async function getFeaturedProjects(limit: number = 6) {
  try {
    await dbConnect();
    const projects = await Project.find({ isActive: true, isFeatured: true })
      .select(
        "title slug description content excerpt coverImage images tags category client duration technologies isActive isFeatured order createdAt updatedAt"
      )
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .lean();

    // Serialize the data to remove MongoDB ObjectId and Date objects
    return projects.map((project: Record<string, unknown>) => ({
      ...project,
      _id: (project._id as { toString(): string })?.toString() || "",
      createdAt:
        (project.createdAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        (project.updatedAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching featured projects from database:", error);
    return [];
  }
}

/**
 * Get projects by category from MongoDB
 */
export async function getProjectsByCategory(category: string) {
  try {
    await dbConnect();
    const projects = await Project.find({ isActive: true, category })
      .select(
        "title slug description excerpt coverImage tags category client duration technologies isFeatured order createdAt updatedAt"
      )
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Serialize the data to remove MongoDB ObjectId and Date objects
    return projects.map((project: Record<string, unknown>) => ({
      ...project,
      _id: (project._id as { toString(): string })?.toString() || "",
      createdAt:
        (project.createdAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
      updatedAt:
        (project.updatedAt as { toISOString(): string })?.toISOString() ||
        new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching projects by category from database:", error);
    return [];
  }
}

/**
 * Get a project by slug from MongoDB (for static generation)
 */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectData | null> {
  try {
    await dbConnect();
    const project = await Project.findOne({ slug, isActive: true })
      .select(
        "title slug description excerpt coverImage tags category client duration technologies isFeatured order createdAt updatedAt liveUrl githubUrl content metaDescription"
      )
      .lean();

    if (!project) return null;

    // Serialize the data to remove MongoDB ObjectId and Date objects
    const serializedProject = {
      ...project,
      _id: (project as Record<string, unknown>)._id?.toString() || "",
      createdAt:
        (
          (project as Record<string, unknown>).createdAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
      updatedAt:
        (
          (project as Record<string, unknown>).updatedAt as {
            toISOString(): string;
          }
        )?.toISOString() || new Date().toISOString(),
    };

    return serializedProject as unknown as ProjectData;
  } catch (error) {
    console.error("Error fetching project from database:", error);
    return null;
  }
}

/**
 * Get all project categories from MongoDB
 */
export async function getAllProjectCategories(): Promise<ProjectCategory[]> {
  try {
    await dbConnect();
    const categories = await Project.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return categories.map((cat: Record<string, unknown>) => ({
      name: cat._id as string,
      postCount: cat.count as number,
    }));
  } catch (error) {
    console.error("Error fetching project categories from database:", error);
    return [];
  }
}

/**
 * Get all project tags from MongoDB
 */
export async function getAllProjectTags(): Promise<ProjectTag[]> {
  try {
    await dbConnect();
    const tags = await Project.aggregate([
      { $match: { isActive: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return tags.map((tag: Record<string, unknown>) => ({
      name: tag._id as string,
      postCount: tag.count as number,
    }));
  } catch (error) {
    console.error("Error fetching project tags from database:", error);
    return [];
  }
}
