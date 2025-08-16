import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Footer from "@/models/Footer";

export async function GET() {
  try {
    await dbConnect();

    const footer = await Footer.findOne().sort({ createdAt: -1 });

    if (!footer) {
      return NextResponse.json(
        { success: false, message: "Footer content not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: footer,
    });
  } catch (error) {
    console.error("Error fetching footer content:", error);
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

    // Find existing footer or create new one
    let footer = await Footer.findOne();

    if (footer) {
      // Update existing footer - remove _id from body to avoid validation issues
      const updateData = { ...body };
      delete updateData._id;
      footer = await Footer.findByIdAndUpdate(footer._id, updateData, {
        new: true,
        runValidators: true,
      });
    } else {
      // Create new footer - remove _id if it exists in body
      const createData = { ...body };
      delete createData._id;
      footer = await Footer.create(createData);
    }

    return NextResponse.json({
      success: true,
      data: footer,
      message: footer
        ? "Footer content updated successfully"
        : "Footer content created successfully",
    });
  } catch (error) {
    console.error("Error updating footer content:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
