import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AboutUs from "@/models/AboutUs";

export async function GET() {
  try {
    await dbConnect();

    const aboutUs = await AboutUs.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    if (!aboutUs) {
      return NextResponse.json(
        { success: false, message: "About Us content not found" },
        { status: 404 }
      );
    }

    // Convert Mongoose document to plain object
    const aboutUsData = aboutUs.toObject();

    return NextResponse.json({
      success: true,
      data: aboutUsData,
      message: "About Us content retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
