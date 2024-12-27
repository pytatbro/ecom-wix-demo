import { getWixServerClient } from "@/lib/wix-client.server";
import { wixSignUp } from "@/wix-api/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let statusCode = 500;
  let errorMessage = "An unexpected error occurred";
  try {
    const { firstName, lastName, email, password } = await req.json();
    const wixClient = await getWixServerClient();
    const response = await wixSignUp(wixClient, {
      email,
      password,
      profile: { firstName, lastName },
    });
    console.log(response);
    switch (response.loginState) {
      case "FAILURE":
        if (response.errorCode === "emailAlreadyExists") {
          statusCode = 409;
          errorMessage =
            "This email is already associated with another account.";
        }
        return NextResponse.json(
          { error: errorMessage, errorCode: response.errorCode },
          { status: statusCode },
        );

      case "OWNER_APPROVAL_REQUIRED":
        return NextResponse.json(
          {
            message:
              "Sign up successfully, but account requires owner approval before activation.",
            messageCode: "ownerApprovalRequired",
          },
          { status: 202 },
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
