import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

// GET /api/admin/blogs - Get all blogs (including drafts)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const blogs = await blogService.getAllBlogs();

    // Filter by status
    let filteredBlogs = blogs;
    if (status === "published") {
      filteredBlogs = blogs.filter((blog) => !blog.featured); // Assuming featured means draft
    } else if (status === "draft") {
      filteredBlogs = blogs.filter((blog) => blog.featured); // Assuming featured means draft
    }

    // Search functionality
    if (search) {
      filteredBlogs = filteredBlogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(search.toLowerCase()) ||
          blog.description.toLowerCase().includes(search.toLowerCase()) ||
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Pagination
    const total = filteredBlogs.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedBlogs = filteredBlogs.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: {
        blogs: paginatedBlogs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

// POST /api/admin/blogs - Create a new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { frontmatter, content, excerpt } = body;

    // Validate required fields
    if (!frontmatter || !content) {
      return NextResponse.json(
        { success: false, error: "Frontmatter and content are required" },
        { status: 400 }
      );
    }

    // Validate frontmatter
    const requiredFields = [
      "title",
      "slug",
      "description",
      "category",
      "date",
      "coverImage",
      "ogImage",
      "author",
    ];
    for (const field of requiredFields) {
      if (!frontmatter[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate author
    if (!frontmatter.author.name || !frontmatter.author.profileUrl) {
      return NextResponse.json(
        { success: false, error: "Author name and profile URL are required" },
        { status: 400 }
      );
    }

    // Create the blog
    const blog = await blogService.createBlog(frontmatter, content, excerpt);

    return NextResponse.json(
      {
        success: true,
        data: {
          blog: blog.toSummary(),
          message: "Blog created successfully",
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating blog:", error);

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
