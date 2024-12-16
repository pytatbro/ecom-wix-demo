import { createClient, OAuthStrategy, Tokens } from "@wix/sdk";
import { env } from "./env";
import { NextRequest, NextResponse } from "next/server";

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

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
