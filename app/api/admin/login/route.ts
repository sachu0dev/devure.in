import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    // Check if admin credentials are configured
    if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
      console.error(
        "Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables."
      );
      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authentication not configured. Please contact administrator.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    // Debug logging (remove in production)
    console.log("Login attempt:", {
      username,
      password: password ? "***" : "undefined",
    });
    console.log("Environment variables:", {
      ADMIN_USERNAME: env.ADMIN_USERNAME,
      ADMIN_PASSWORD: env.ADMIN_PASSWORD ? "***" : "undefined",
    });

    // Also check process.env directly
    console.log("Direct process.env:", {
      ADMIN_USERNAME: process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "***" : "undefined",
    });

    // Validate input
    if (!username || !password) {
      console.log("Missing credentials");
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    // Verify credentials against server-side environment variables
    if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
      console.log("Login successful for user:", username);
      // Generate a simple session token (in production, use JWT)
      const sessionToken = `admin-session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Set HTTP-only cookie for session management
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          username: username,
          sessionToken: sessionToken,
        },
      });

      // Set secure cookie (in production, add httpOnly: true, secure: true, sameSite: 'strict')
      response.cookies.set("admin-session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    } else {
      console.log("Login failed - invalid credentials");
      console.log("Expected:", {
        username: env.ADMIN_USERNAME,
        password: env.ADMIN_PASSWORD ? "***" : "undefined",
      });
      console.log("Received:", {
        username,
        password: password ? "***" : "undefined",
      });
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// GET method to check if user is authenticated
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("admin-session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    // In production, validate the session token against a database or JWT
    // For now, we'll just check if the cookie exists
    return NextResponse.json({
      success: true,
      message: "Authenticated",
      data: {
        authenticated: true,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// DELETE method to logout (clear session)
export async function DELETE() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful",
    });

    // Clear the session cookie
    response.cookies.set("admin-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
