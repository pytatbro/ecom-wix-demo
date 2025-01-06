import { ApiKeyStrategy, createClient, Tokens } from "@wix/sdk";
import { getWixClient } from "./wix-client.base";
import { cookies } from "next/headers";
import { env } from "@/env";
import { cache } from "react";
import { files } from "@wix/media";
import { members } from "@wix/members";

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

export const getWixManageMediaClient = cache(() => {
  return createClient({
    modules: {
      files,
    },
    auth: ApiKeyStrategy({
      apiKey: env.WIX_MANAGE_SITE_MEDIA_API_KEY,
      siteId: env.WIX_SITE_ID,
    }),
  });
});

export const getWixManageMembersClient = cache(() => {
  return createClient({
    modules: {
      members,
    },
    auth: ApiKeyStrategy({
      apiKey: env.WIX_EXTERNAL_LOGIN_API_KEY,
      siteId: env.WIX_SITE_ID,
    }),
  });
});
