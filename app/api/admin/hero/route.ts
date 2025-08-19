import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Hero from "@/models/Hero";

// GET - Fetch hero content
export async function GET() {
  try {
    await dbConnect();

    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      // Create default hero content if none exists
      const defaultHero = new Hero({
        title1: "GENUINE.",
        title2: "IMPACT.",
        description:
          "At Devure, we help businesses build, launch, and scale custom web applications — blending design, development, and technical expertise to deliver solutions that work and grow with you.",
        images: [
          {
            url: "https://placehold.co/500x700/618C70/FFFFFF/png",
            alt: "Devure Hero Image 1",
            order: 0,
          },
          {
            url: "https://placehold.co/500x700/618C70/FFFFFF/png",
            alt: "Devure Hero Image 2",
            order: 1,
          },
          {
            url: "https://placehold.co/500x700/618C70/FFFFFF/png",
            alt: "Devure Hero Image 3",
            order: 2,
          },
        ],
        links: [
          {
            name: "Portfolio",
            url: "https://devbysushil.com",
            order: 0,
          },
          {
            name: "Github",
            url: "https://github.com/sachu0dev",
            order: 1,
          },
          {
            name: "Twitter",
            url: "https://x.com/sachu0dev",
            order: 2,
          },
          {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/sachu0dev",
            order: 3,
          },
        ],
        showOnHome: true,
        isActive: true,
      });

      hero = await defaultHero.save();
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

// POST - Create new hero content
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Check if there's already active hero content
    const existingHero = await Hero.findOne({ isActive: true });
    if (existingHero) {
      return NextResponse.json(
        { error: "Hero content already exists. Use PUT to update." },
        { status: 400 }
      );
    }

    const hero = new Hero(body);
    await hero.save();

    return NextResponse.json({ data: hero }, { status: 201 });
  } catch (error) {
    console.error("Error creating hero content:", error);
    return NextResponse.json(
      { error: "Failed to create hero content" },
      { status: 500 }
    );
  }
}

// PUT - Update existing hero content
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Find active hero content
    let hero = await Hero.findOne({ isActive: true });

    if (!hero) {
      // Create new if none exists
      hero = new Hero(body);
    } else {
      // Update existing
      Object.assign(hero, body);
    }

    await hero.save();

    return NextResponse.json({ data: hero });
  } catch (error) {
    console.error("Error updating hero content:", error);
    return NextResponse.json(
      { error: "Failed to update hero content" },
      { status: 500 }
    );
  }
}
