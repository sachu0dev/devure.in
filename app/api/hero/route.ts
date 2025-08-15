import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Hero from "@/models/Hero";

// GET - Fetch hero content for home page
export async function GET() {
  try {
    await dbConnect();

    const hero = await Hero.findOne({ showOnHome: true, isActive: true });

    if (!hero) {
      return NextResponse.json(
        { error: "No hero content found for home page" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}
