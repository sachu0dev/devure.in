import { NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

// GET /api/blogs/tags - Get all tags
export async function GET() {
  try {
    const tags = await blogService.getTags();

    return NextResponse.json({
      success: true,
      data: { tags },
    });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
