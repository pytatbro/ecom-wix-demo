import { env } from "@/env";
import { getWixServerClient } from "@/lib/wix-client.server";
import { wixLogin } from "@/wix-api/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";

  try {
    const { email, password } = await req.json();
    const wixClient = await getWixServerClient();
    const response = await wixLogin(wixClient, { email, password });
    console.log(response.loginState);
    switch (response.loginState) {
      case "FAILURE":
        switch (response.errorCode) {
          case "invalidEmail":
            statusCode = 400;
            errorMessage = "This email does not exist.";
            break;
          case "invalidPassword":
            statusCode = 401;
            errorMessage = "Invalid password.";
            break;
          case "resetPassword":
            statusCode = 403;
            errorMessage =
              "An email has been sent to your email address. Please reset your password to continue.";
            const redirectURi = `${env.NEXT_PUBLIC_BASE_URL}/login`;
            try {
              await wixClient.auth.sendPasswordResetEmail(email, redirectURi);
            } catch (error) {
              console.error("Failed to send password reset email:", error);
            }
            break;
        }
        return NextResponse.json(
          { error: errorMessage, errorCode: response.errorCode },
          { status: statusCode },
        );

      case "EMAIL_VERIFICATION_REQUIRED":
        statusCode = 403;
        errorMessage =
          "A verification code has been sent to your email address. Please verify your email address to continue.";
        (await cookies()).set("stateVerify", JSON.stringify(response), {
          httpOnly: true,
          maxAge: 15 * 60, // 15 minutes
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return NextResponse.json(
          { error: errorMessage, errorCode: "verifyNeeded" },
          { status: statusCode },
        );

      case "SUCCESS":
        return NextResponse.json({
          success: true,
          sessionToken: response.data.sessionToken,
        });

      default:
        return NextResponse.json(
          { error: errorMessage },
          { status: statusCode },
        );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
