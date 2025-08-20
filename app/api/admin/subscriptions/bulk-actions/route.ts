import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// POST /api/admin/subscriptions/bulk-actions - Bulk actions on subscriptions
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { subscriptionIds, action } = await request.json();

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

    if (!action || !["pause", "activate"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid action (pause or activate) is required",
        },
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

    // Update subscriptions
    const updateData = { isActive: action === "activate" };

    const result = await Subscription.updateMany(
      { _id: { $in: validIds } },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ${action}d ${result.modifiedCount} subscription(s)`,
      modifiedCount: result.modifiedCount,
      action,
    });
  } catch (error) {
    console.error("Error performing bulk actions on subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform bulk actions" },
      { status: 500 }
    );
  }
}
