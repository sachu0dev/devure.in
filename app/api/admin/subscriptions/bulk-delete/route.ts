import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// POST /api/admin/subscriptions/bulk-delete - Bulk delete subscriptions
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { subscriptionIds } = await request.json();

    if (
      !subscriptionIds ||
      !Array.isArray(subscriptionIds) ||
      subscriptionIds.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Subscription IDs array is required" },
        { status: 400 }
      );
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const validIds = subscriptionIds.filter((id: string) =>
      /^[0-9a-fA-F]{24}$/.test(id)
    );

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid subscription IDs provided" },
        { status: 400 }
      );
    }

    // Delete subscriptions
    const result = await Subscription.deleteMany({
      _id: { $in: validIds },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} subscription(s)`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error bulk deleting subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscriptions" },
      { status: 500 }
    );
  }
}
