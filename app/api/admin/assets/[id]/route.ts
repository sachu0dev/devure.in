import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/models/Asset";
import { s3Service } from "@/lib/s3";

// DELETE - Delete asset by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const asset = await Asset.findByIdAndDelete(id);

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Delete from S3 as well
    let s3Deleted = false;
    try {
      await s3Service.deleteAsset(asset.s3Key);
      console.log(`✅ Deleted asset from S3: ${asset.s3Key}`);
      s3Deleted = true;
    } catch (s3Error) {
      console.error(
        `⚠️ Failed to delete asset from S3: ${asset.s3Key}`,
        s3Error
      );
      // Continue with database deletion even if S3 deletion fails
      // This ensures database consistency even if S3 cleanup fails
    }

    return NextResponse.json({
      message: s3Deleted
        ? "Asset deleted successfully from database and S3"
        : "Asset deleted from database but S3 cleanup failed",
      data: asset,
      s3Deleted,
    });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}

// PUT - Update asset by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const asset = await Asset.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ data: asset });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      { error: "Failed to update asset" },
      { status: 500 }
    );
  }
}
