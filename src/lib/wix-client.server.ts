import { Tokens } from "@wix/sdk";
import { getWixClient } from "./wix-client.base";
import { cookies } from "next/headers";
import { env } from "@/env";
import { cache } from "react";

export const getWixServerClient = cache(async () => {
  let tokens: Tokens | undefined;
  const fetchedCookies = await cookies();
  try {
    tokens = JSON.parse(
      fetchedCookies.get(env.NEXT_PUBLIC_WIX_SESSION_COOKIE)?.value || "{}",
    );
  } catch (error) {
    console.log(error);
  }

  return getWixClient(tokens);
});
