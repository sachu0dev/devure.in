import { NextRequest, NextResponse } from "next/server";
import { sendBlogUpdateEmails } from "@/lib/emailService";

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, slug, image, authorName, publishDate } =
      await request.json();

    // Validate required fields
    if (!title || !excerpt || !slug) {
      return NextResponse.json(
        { error: "Title, excerpt, and slug are required" },
        { status: 400 }
      );
    }

    const blogData = {
      title,
      excerpt,
      slug,
      image,
      authorName: authorName || "Devure Team",
      publishDate: publishDate || new Date().toLocaleDateString(),
    };

    const result = await sendBlogUpdateEmails(blogData);

    if (result.success) {
      return NextResponse.json({
        message: "Blog update emails sent successfully",
        ...result,
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send blog update emails" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Blog notify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
