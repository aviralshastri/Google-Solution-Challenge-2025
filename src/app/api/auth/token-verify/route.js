import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_KEY) {
      console.error("JWT secret key is not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_KEY);
      return NextResponse.json({
        valid: true,
        payload: decoded
      });
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return NextResponse.json(
          { valid: false, error: "Token has expired" },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify authentication token" },
      { status: 500 }
    );
  }
}