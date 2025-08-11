import { NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

// GET /api/blogs/categories - Get all categories
export async function GET() {
  try {
    const categories = await blogService.getCategories();

    return NextResponse.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
