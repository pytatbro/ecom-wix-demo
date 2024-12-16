import { env } from "@/env";
import { Tokens } from "@wix/sdk";
import Cookies from "js-cookie";
import { getWixClient } from "./wix-client.base";

const tokens: Tokens = JSON.parse(
  Cookies.get(env.NEXT_PUBLIC_WIX_SESSION_COOKIE) || "{}",
);

export const wixBrowserClient = getWixClient(tokens);
