import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Footer from "@/models/Footer";

export async function GET() {
  try {
    await dbConnect();

    const footer = await Footer.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

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
