import { NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

// GET /api/admin/stats - Get blog statistics
export async function GET() {
  try {
    const stats = await blogService.getBlogStats();

    return NextResponse.json({
      success: true,
      data: { stats },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
