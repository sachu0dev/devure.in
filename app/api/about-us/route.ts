import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import AboutUs from "@/models/AboutUs";

export async function GET() {
  try {
    await dbConnect();

    let aboutUs = await AboutUs.findOne({ isActive: true }).sort({
      createdAt: -1,
    });

    // If no AboutUs content exists, create default content
    if (!aboutUs) {
      const defaultAboutUs = new AboutUs({
        subtitle: "ABOUT US",
        title: "About Devure.in",
        description:
          "We are a passionate team of developers, designers, and innovators dedicated to creating exceptional digital experiences. With years of experience in web development, mobile apps, and custom software solutions, we help businesses transform their ideas into powerful, scalable applications that drive growth and success.",
        additionalDescription:
          "Our commitment to excellence extends beyond just coding. We believe in building lasting partnerships with our clients, understanding their unique challenges, and delivering solutions that not only meet their immediate needs but also position them for long-term success in an ever-evolving digital landscape.",
        learnMoreButton: {
          text: "Learn More",
          url: "/about",
        },
        imageUrl: "/images/about-us-hero.jpg",
        isActive: true,
      });

      aboutUs = await defaultAboutUs.save();
    }

    // Convert Mongoose document to plain object
    const aboutUsData = aboutUs.toObject();

    return NextResponse.json({
      success: true,
      data: aboutUsData,
      message: "About Us content retrieved successfully",
    });
  } catch (error) {
    console.error("❌ AboutUs API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
