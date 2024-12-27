import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { env } from "./env";
import { NextRequest, NextResponse } from "next/server";
import { getWixClient } from "./lib/wix-client.base";

const wixClient = createClient({
  auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID }),
});

export async function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const sessionCookie = cookies.get(env.NEXT_PUBLIC_WIX_SESSION_COOKIE);

  let sessionTokens = sessionCookie
    ? (JSON.parse(sessionCookie.value) as Tokens)
    : await wixClient.auth.generateVisitorTokens();

  if (sessionTokens.accessToken.expiresAt < Math.floor(Date.now() / 1000)) {
    try {
      sessionTokens = await wixClient.auth.renewToken(
        sessionTokens.refreshToken,
      );
    } catch (error) {
      console.log(error);
      sessionTokens = await wixClient.auth.generateVisitorTokens();
    }
  }

  request.cookies.set(
    env.NEXT_PUBLIC_WIX_SESSION_COOKIE,
    JSON.stringify(sessionTokens),
  );
  const res = NextResponse.next({ request });
  res.cookies.set(
    env.NEXT_PUBLIC_WIX_SESSION_COOKIE,
    JSON.stringify(sessionTokens),
    {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      secure: process.env.NODE_ENV === "production",
    },
  );

  const isLoggedIn = getWixClient(sessionTokens).auth.loggedIn();

  // Redirect URL for auth
  const authPages = [
    "/login",
    "/signup",
    "/forgot-password",
    "/verification",
    "/api/auth/login",
    "/api/auth/signup",
    "/api/auth/verification",
    "/api/auth/forgot-password",
    "/api/auth/external/google",
  ];
  const currentPath = request.nextUrl.pathname;

  if (isLoggedIn && authPages.includes(currentPath)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (currentPath === "/verification") {
    const token = request.nextUrl.searchParams.get("token");
    const cookieToken = cookies.get(env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE);

    if (!token || !cookieToken || token !== cookieToken.value) {
      // Redirect unauthorized access to home page
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (!authPages.includes(currentPath)) {
    // Set the `redirectUrl` cookie for non-authentication pages
    res.cookies.set("redirectUrl", currentPath, {
      maxAge: 60 * 60, // 1 hour
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
