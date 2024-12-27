import { env } from "@/env";
import { getWixServerClient } from "@/lib/wix-client.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const wixClient = await getWixServerClient();
    const redirectURi = `${env.NEXT_PUBLIC_BASE_URL}/login`;
    await wixClient.auth.sendPasswordResetEmail(email, redirectURi);
    return NextResponse.json({
      success: true,
      message:
        "An email has been sent to your email address. Please reset your password to continue.",
    });
  } catch (error) {
    console.error("Error sending password reset email", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
