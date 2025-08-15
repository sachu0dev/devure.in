import { NextRequest, NextResponse } from "next/server";
import { s3Service } from "@/lib/s3";
import dbConnect from "@/lib/mongodb";
import Asset from "@/models/Asset";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("file") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
    const fileName = `assets/${timestamp}-${randomString}.${fileExtension}`;

    // Upload to S3 and get the URL
    const uploadResult = await s3Service.uploadImage(
      fileName,
      buffer,
      imageFile.type
    );

    // Get the public URL from the S3 service
    const publicUrl = uploadResult.url;

    // Create asset record in database
    await dbConnect();

    const assetData = {
      name: imageFile.name,
      url: publicUrl,
      s3Key: fileName,
      s3Bucket: fileName.split("/")[0], // Extract bucket from key
      alt: imageFile.name,
      description: `Uploaded via admin panel`,
      tags: ["uploaded"],
      category: "general",
      fileSize: imageFile.size,
      mimeType: imageFile.type,
      isPublic: true,
      uploadedBy: "admin", // You can get this from auth context later
    };

    const asset = new Asset(assetData);
    await asset.save();

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        key: fileName,
        size: imageFile.size,
        type: imageFile.type,
        assetId: asset._id,
        asset: asset,
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
