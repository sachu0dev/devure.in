import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET - Fetch active projects for frontend
export async function GET() {
  console.log("Projects API route hit!");
  try {
    console.log("Connecting to database...");
    await dbConnect();
    console.log("Database connected successfully");

    console.log("Querying projects...");
    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select(
        "title slug description excerpt coverImage tags category client duration technologies isFeatured order"
      )
      .lean();

    console.log(`Found ${projects.length} projects:`, projects);
    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error("Error in projects API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
