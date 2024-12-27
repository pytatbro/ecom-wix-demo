import { env } from "@/env";
import { getWixServerClient } from "@/lib/wix-client.server";
import { members } from "@wix/members";
import { ApiKeyStrategy, createClient } from "@wix/sdk";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";

  try {
    const { tokenResponse } = await req.json();
    if (!tokenResponse) {
      statusCode = 400;
      errorMessage = "No response from Google. Please try again";
      return NextResponse.json({ error: errorMessage }, { status: statusCode });
    }
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      },
    );
    const userInfo = userInfoResponse.data;
    const apiWixClient = createClient({
      modules: {
        members,
      },
      auth: ApiKeyStrategy({
        apiKey: env.WIX_EXTERNAL_LOGIN_API_KEY,
        siteId: env.WIX_SITE_ID,
      }),
    });
    const { items } = await apiWixClient.members
      .queryMembers()
      .eq("loginEmail", userInfo.email)
      .find();
    let user;
    if (items && items.length > 0) {
      user = items[0];
    } else {
      user = await apiWixClient.members.createMember({
        member: {
          loginEmail: userInfo.email,
          contact: {
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
          },
          status: members.Status.APPROVED,
          privacyStatus: members.PrivacyStatusStatus.PRIVATE,
        },
      });
    }
    const oAuthWixClient = await getWixServerClient();
    const tokens = await oAuthWixClient.auth.getMemberTokensForExternalLogin(
      user._id!,
      env.WIX_EXTERNAL_LOGIN_API_KEY,
    );
    (await cookies()).set(
      env.NEXT_PUBLIC_WIX_SESSION_COOKIE,
      JSON.stringify(tokens),
      {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
      },
    );
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
