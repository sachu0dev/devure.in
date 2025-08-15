import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";

// GET - Fetch active services for frontend
export async function GET() {
  try {
    await dbConnect();

    const services = await Service.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("serviceType title slug image excerpt isFeatured order")
      .lean();

    return NextResponse.json({ data: services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
