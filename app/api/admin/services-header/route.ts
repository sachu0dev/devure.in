import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ServicesHeader from "@/models/ServicesHeader";

// GET - Fetch services header
export async function GET() {
  try {
    await dbConnect();

    let header = await ServicesHeader.findOne({ isActive: true });

    if (!header) {
      // Create default services header if none exists
      const defaultHeader = new ServicesHeader({
        mainTitle: "Creating impact in",
        services: [
          "CRM",
          "Chat Apps",
          "E-commerce",
          "SaaS",
          "Portfolio",
          "Analytics",
          "Social Network",
          "API Platform",
          "Blog/CMS",
          "Marketplace",
        ],
        isActive: true,
      });

      header = await defaultHeader.save();
      console.log("✅ Created default services header");
    }

    return NextResponse.json({ data: header });
  } catch (error) {
    console.error("Error fetching services header:", error);
    return NextResponse.json(
      { error: "Failed to fetch services header" },
      { status: 500 }
    );
  }
}

// PUT - Update services header
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Find active header
    let header = await ServicesHeader.findOne({ isActive: true });

    if (!header) {
      // Create new if none exists
      header = new ServicesHeader(body);
    } else {
      // Update existing
      Object.assign(header, body);
    }

    await header.save();

    return NextResponse.json({ data: header });
  } catch (error) {
    console.error("Error updating services header:", error);
    return NextResponse.json(
      { error: "Failed to update services header" },
      { status: 500 }
    );
  }
}
