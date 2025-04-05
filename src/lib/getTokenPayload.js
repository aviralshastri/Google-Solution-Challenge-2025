"use server";
import { cookies } from "next/headers";

export async function getPayloadFromToken() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    console.error("No auth_token found in cookies");
    return null;
  }

  try {
    const baseUrl = process.env.BASE_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/auth/token-get-data?token=${token}`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return data.payload;
    } else {
      console.error("Token invalid or expired:", data.error);
      return null;
    }
  } catch (err) {
    console.error("Failed to fetch token payload:", err);
    return null;
  }
}
