import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const tags =
      searchParams.get("tags")?.split(",").filter(Boolean) || undefined;
    const author = searchParams.get("author") || undefined;
    const featured = searchParams.get("featured") === "true" ? true : undefined;
    const sortBy =
      (searchParams.get("sortBy") as
        | "date"
        | "title"
        | "readTime"
        | "wordCount") || "date";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build search options
    const searchOptions = {
      query,
      category,
      tags,
      author,
      featured,
      sortBy,
      sortOrder,
      limit,
      offset,
    };

    // Get blogs
    const result = await blogService.searchBlogs(searchOptions);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
