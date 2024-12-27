import { getWixServerClient } from "@/lib/wix-client.server";
import { wixEmailVerify } from "@/wix-api/auth";
import { StateMachine } from "@wix/sdk";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const verifyCookie = await cookies();
    const wixClient = await getWixServerClient();
    const stateMachineCookie = verifyCookie.get("stateVerify");
    if (!stateMachineCookie) {
      return NextResponse.json(
        { error: "An unexpected error occurred. Please try again" },
        { status: 500 },
      );
    }
    const stateMachineResponse: StateMachine = JSON.parse(
      stateMachineCookie.value,
    );
    const response = await wixEmailVerify(
      wixClient,
      code,
      stateMachineResponse,
    );
    if (response.loginState === "SUCCESS") {
      verifyCookie.delete("stateVerify");
      return NextResponse.json({
        success: true,
        sessionToken: response.data.sessionToken,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying email", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}
