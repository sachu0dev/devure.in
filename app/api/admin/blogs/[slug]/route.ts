import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blogService";

// GET /api/admin/blogs/[slug] - Get a specific blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await blogService.getBlogBySlug(slug);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { blog },
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/blogs/[slug] - Update a blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { frontmatter, content, excerpt } = body;

    // Validate required fields
    if (!frontmatter) {
      return NextResponse.json(
        { success: false, error: "Frontmatter is required" },
        { status: 400 }
      );
    }

    // Update the blog
    const blog = await blogService.updateBlog(
      slug,
      frontmatter,
      content,
      excerpt
    );

    return NextResponse.json({
      success: true,
      data: {
        blog: blog.toSummary(),
        message: "Blog updated successfully",
      },
    });
  } catch (error: unknown) {
    console.error("Error updating blog:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/blogs/[slug] - Delete a blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await blogService.deleteBlog(slug);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting blog:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/blogs/[slug] - Toggle blog status (draft/published, featured)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { action } = body; // 'toggleDraft' or 'toggleFeatured'

    let blog;
    switch (action) {
      case "toggleDraft":
        blog = await blogService.toggleDraftStatus(slug);
        break;
      case "toggleFeatured":
        blog = await blogService.toggleFeaturedStatus(slug);
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Use "toggleDraft" or "toggleFeatured"',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        blog: blog.toSummary(),
        message: `Blog ${
          action === "toggleDraft" ? "draft status" : "featured status"
        } updated successfully`,
      },
    });
  } catch (error: unknown) {
    console.error("Error toggling blog status:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update blog status" },
      { status: 500 }
    );
  }
}
