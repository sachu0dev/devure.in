import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

// GET - Get service by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const { slug } = await params;

    // Only return active services for public access
    const service = await Service.findOne({
      slug,
      isActive: true,
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ data: service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}
