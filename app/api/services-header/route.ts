import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ServicesHeader from "@/models/ServicesHeader";

// GET - Fetch services header for frontend
export async function GET() {
  try {
    await dbConnect();

    let header = await ServicesHeader.findOne({ isActive: true });

    if (!header) {
      // Create default services header if none exists (same as admin route)
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
