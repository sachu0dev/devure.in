import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AboutUs from "@/models/AboutUs";

export async function GET() {
  try {
    await dbConnect();

    const aboutUs = await AboutUs.findOne().sort({ createdAt: -1 });

    if (!aboutUs) {
      return NextResponse.json(
        { success: false, message: "About Us content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: aboutUs,
    });
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Find existing About Us or create new one
    let aboutUs = await AboutUs.findOne();

    if (aboutUs) {
      // Update existing About Us - remove _id from body to avoid validation issues
      const updateData = { ...body };
      delete updateData._id;
      aboutUs = await AboutUs.findByIdAndUpdate(aboutUs._id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      // Create new About Us - remove _id if it exists in body
      const createData = { ...body };
      delete createData._id;
      aboutUs = await AboutUs.create(createData);
    }

    return NextResponse.json({
      success: true,
      data: aboutUs,
      message: aboutUs
        ? "About Us content updated successfully"
        : "About Us content created successfully",
    });
  } catch (error) {
    console.error("Error updating About Us content:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
