import { wixBrowserClient } from "@/lib/wix-client.browser";
import { useToast } from "./use-toast";
import Cookies from "js-cookie";
import { env } from "@/env";

export default function useLoginSuccess() {
  const { toast } = useToast();
  async function loginSuccess(sessionToken: string) {
    try {
      const wixClient = wixBrowserClient;
      const tokens =
        await wixClient.auth.getMemberTokensForDirectLogin(sessionToken);
      Cookies.set(env.NEXT_PUBLIC_WIX_SESSION_COOKIE, JSON.stringify(tokens), {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
      });

      const redirectUrl = Cookies.get("redirectUrl") || "/";
      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }
  return { loginSuccess };
}
