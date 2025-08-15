import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Project from "@/models/Project";

// GET - Fetch active projects for frontend
export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select(
        "title slug description excerpt coverImage tags category client duration technologies isFeatured order"
      )
      .lean();

    return NextResponse.json({ data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
