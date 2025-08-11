import { NextRequest, NextResponse } from "next/server";
import { s3Service } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `blog-images/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to S3 and get the URL
    const uploadResult = await s3Service.uploadImage(
      fileName,
      buffer,
      imageFile.type
    );

    // Return the public URL from the S3 service
    const publicUrl = uploadResult.url;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        key: fileName,
        size: imageFile.size,
        type: imageFile.type,
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
