import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Asset from "@/models/Asset";
import { s3Service } from "@/lib/s3";

// POST - Bulk delete assets
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { assetIds } = await request.json();

    if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
      return NextResponse.json(
        { error: "Asset IDs array is required" },
        { status: 400 }
      );
    }

    // Find all assets to be deleted
    const assets = await Asset.find({ _id: { $in: assetIds } });

    if (assets.length === 0) {
      return NextResponse.json(
        { error: "No assets found to delete" },
        { status: 404 }
      );
    }

    const results = {
      total: assets.length,
      deleted: 0,
      s3Deleted: 0,
      errors: [] as string[],
    };

    // Delete each asset
    for (const asset of assets) {
      try {
        // Delete from S3 first
        try {
          await s3Service.deleteAsset(asset.s3Key);
          results.s3Deleted++;
        } catch (s3Error) {
          console.error(
            `⚠️ Failed to delete asset from S3: ${asset.s3Key}`,
            s3Error
          );
          results.errors.push(
            `S3 deletion failed for ${asset.name}: ${s3Error}`
          );
        }

        // Delete from database
        await Asset.findByIdAndDelete(asset._id);
        results.deleted++;
      } catch (error) {
        console.error(`❌ Failed to delete asset: ${asset.name}`, error);
        results.errors.push(
          `Database deletion failed for ${asset.name}: ${error}`
        );
      }
    }

    return NextResponse.json({
      message: `Bulk delete completed. ${results.deleted}/${results.total} assets deleted.`,
      results,
    });
  } catch (error) {
    console.error("Error in bulk delete:", error);
    return NextResponse.json(
      { error: "Failed to perform bulk delete" },
      { status: 500 }
    );
  }
}
