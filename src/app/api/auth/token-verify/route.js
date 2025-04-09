import { verify } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


async function verifyUserAccount(uid) {
  try {
    const userDocRef = doc(db, "accounts", uid);
    const userDocSnap = await getDoc(userDocRef);
  
    return userDocSnap.exists();
  } catch (error) {
    console.error("Error checking user in Firestore:", error);
    throw new Error("Failed to verify user account");
  }
}

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
      
      const userExists = await verifyUserAccount(decoded.uid);
      
      if (!userExists) {
        return NextResponse.json(
          { valid: false, error: "User account not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        valid: true,
        payload: decoded
      });
      
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      
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