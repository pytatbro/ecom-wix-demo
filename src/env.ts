import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
    WIX_EXTERNAL_LOGIN_API_KEY: z.string().min(1),
    WIX_MANAGE_SITE_MEDIA_API_KEY: z.string().min(1),
    WIX_SITE_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_WIX_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_WIX_STORE_APP_ID: z.string().min(1),
    NEXT_PUBLIC_WIX_SESSION_COOKIE: z.string().min(1),
    NEXT_PUBLIC_WIX_STORE_APP_ID_BACK_IN_STOCK_NOTI: z.string().min(1),
    NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE: z.string().min(1),
    NEXT_PUBLIC_SAME_CATEGORY_ALGORITHM_ID: z.string().min(1),
    NEXT_PUBLIC_BOUGHT_TOGETHER_ALGORITHM_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_WIX_CLIENT_ID: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
    NEXT_PUBLIC_WIX_STORE_APP_ID: process.env.NEXT_PUBLIC_WIX_STORE_APP_ID,
    NEXT_PUBLIC_WIX_SESSION_COOKIE: process.env.NEXT_PUBLIC_WIX_SESSION_COOKIE,
    NEXT_PUBLIC_WIX_STORE_APP_ID_BACK_IN_STOCK_NOTI:
      process.env.NEXT_PUBLIC_WIX_STORE_APP_ID_BACK_IN_STOCK_NOTI,
    NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE:
      process.env.NEXT_PUBLIC_VERIFICATION_TOKEN_COOKIE,
    NEXT_PUBLIC_SAME_CATEGORY_ALGORITHM_ID:
      process.env.NEXT_PUBLIC_SAME_CATEGORY_ALGORITHM_ID,
    NEXT_PUBLIC_BOUGHT_TOGETHER_ALGORITHM_ID:
      process.env.NEXT_PUBLIC_BOUGHT_TOGETHER_ALGORITHM_ID,
  },
});
