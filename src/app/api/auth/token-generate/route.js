import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { uid, email, accountType, fullName } = await request.json();

    if (!uid || !email || !accountType || !fullName) {
      return NextResponse.json(
        { error: "Missing required user information" },
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

    const payload = {
      uid,
      email,
      accountType,
      fullName,
    };

    const token = sign(payload, process.env.JWT_KEY, { expiresIn: "30d" });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication token" },
      { status: 500 }
    );
  }
}
