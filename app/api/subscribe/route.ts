import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscription from "@/models/Subscription";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await Subscription.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          { error: "Email is already subscribed" },
          { status: 409 }
        );
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        await existingSubscription.save();

        return NextResponse.json(
          { message: "Subscription reactivated successfully" },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    const subscription = new Subscription({
      email: email.toLowerCase(),
      isActive: true,
      subscribedAt: new Date(),
      preferences: {
        blogUpdates: true,
        newsletter: true,
        productUpdates: false,
      },
    });

    await subscription.save();

    return NextResponse.json(
      { message: "Subscription successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const subscriptions = await Subscription.find({ isActive: true })
      .select("email subscribedAt preferences")
      .sort({ subscribedAt: -1 });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
