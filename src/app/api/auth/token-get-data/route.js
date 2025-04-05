import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const secret = process.env.JWT_KEY;
    if (!secret) {
      console.error("JWT_KEY not found in environment variables");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    try {
      const payload = verify(token, secret);
      return NextResponse.json({
        success: true,
        message: "Token is valid",
        payload,
      });
    } catch (error) {
      const errorMessage =
        error.name === "TokenExpiredError"
          ? "Token has expired"
          : "Invalid token";

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("Error verifying token:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
