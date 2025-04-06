import { NextResponse } from "next/server";

const protectedRoutes = [
  "/profile",
  "/fitmate",
  "/create-post",
  "/tools",
  "/updates",
  "/edit-profile",
];

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request) {
  const baseUrl = process.env.BASE_URL;

  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;

  try {
    if (!token) {
      if (isAuthRoute) {
        return NextResponse.next();
      }

      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", baseUrl));
      }

      return NextResponse.next();
    }
    const verifyResponse = await fetch(
      new URL("/api/auth/token-verify", baseUrl),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    );

    const verifyResult = await verifyResponse.json();

    if (verifyResult.valid) {
      if (pathname === "/profile" || pathname.startsWith("/profile/")) {
        const tokenDataResponse = await fetch(
          `${baseUrl}/api/auth/token-get-data?token=${token}`,
          {
            cache: "no-store",
          }
        );

        const tokenData = await tokenDataResponse.json();

        if (tokenData.success && tokenData.payload) {
          const { accountType } = tokenData.payload;

          if (accountType === "athlete" || accountType === "promoter") {
            if (pathname === "/profile") {
              return NextResponse.redirect(
                new URL(`/profile/${accountType}`, baseUrl)
              );
            }

            if (pathname === "/profile/athlete" && accountType === "promoter") {
              return NextResponse.redirect(
                new URL("/profile/promoter", baseUrl)
              );
            }

            if (pathname === "/profile/promoter" && accountType === "athlete") {
              return NextResponse.redirect(
                new URL("/profile/athlete", baseUrl)
              );
            }
          }
        }
      }

      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/", baseUrl));
      }
      return NextResponse.next();
    } else {
      console.error("Token verification failed:", verifyResult.error);

      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/login", baseUrl));
        response.cookies.delete("auth_token");
        return response;
      }

      if (isAuthRoute) {
        const response = NextResponse.next();
        response.cookies.delete("auth_token");
        return response;
      }

      const response = NextResponse.next();
      response.cookies.delete("auth_token");
      return response;
    }
  } catch (error) {
    console.error("Middleware error:", error);

    if (isProtectedRoute) {
      const response = NextResponse.redirect(new URL("/login", baseUrl));
      response.cookies.delete("auth_token");
      return response;
    }

    const response = NextResponse.next();
    response.cookies.delete("auth_token");
    return response;
  }
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/fitmate/:path*",
    "/create-post/:path*",
    "/tools/:path*",
    "/updates/:path*",
    "/edit-profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
