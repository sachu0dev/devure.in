import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET(request: NextRequest) {
  try {
    // Basic admin check (you might want to implement proper JWT auth)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    // Build query
    const query: Record<string, unknown> = {};

    // Status filter
    if (status === "callback") {
      query.requestedCall = true;
    } else if (status === "message") {
      query.requestedCall = false;
    }

    // Search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { projectType: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query),
    ]);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
