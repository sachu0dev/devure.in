import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

// GET /api/admin/subscriptions - Get all subscriptions with pagination and search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    // Build query
    const query: Record<
      string,
      boolean | { $regex: string; $options: string }
    > = {};

    if (status === "active") {
      query.isActive = true;
    } else if (status === "paused") {
      query.isActive = false;
    }

    if (search) {
      query.email = { $regex: search, $options: "i" };
    }

    // Get total count for pagination
    const total = await Subscription.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;

    // Get subscriptions with pagination
    const subscriptions = await Subscription.find(query)
      .select("email isActive subscribedAt lastEmailSent preferences")
      .sort({ subscribedAt: -1 })
      .skip(offset)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/subscriptions - Update subscription status
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const { subscriptionId, action } = await request.json();

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { success: false, error: "Subscription ID and action are required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, boolean> = {};

    switch (action) {
      case "pause":
        updateData.isActive = false;
        break;
      case "activate":
        updateData.isActive = true;
        break;
      case "delete":
        // Soft delete by setting isActive to false
        updateData.isActive = false;
        break;
      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action. Use 'pause', 'activate', or 'delete'",
          },
          { status: 400 }
        );
    }

    const subscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      updateData,
      { new: true }
    );

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscription ${action}d successfully`,
      data: subscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/subscriptions - Hard delete subscription
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("id");

    if (!subscriptionId) {
      return NextResponse.json(
        { success: false, error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    const subscription = await Subscription.findByIdAndDelete(subscriptionId);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: "Subscription not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription deleted permanently",
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
