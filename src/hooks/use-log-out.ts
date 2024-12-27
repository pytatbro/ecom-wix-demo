import { wixBrowserClient } from "@/lib/wix-client.browser";
import { wixLogOut } from "@/wix-api/auth";
import Cookies from "js-cookie";
import { env } from "@/env";

export default function useLogOut() {
  async function logout() {
    try {
      const logoutUrl = await wixLogOut(wixBrowserClient);
      Cookies.remove(env.NEXT_PUBLIC_WIX_SESSION_COOKIE);
      window.location.href = logoutUrl;
    } catch (error) {
      console.error(error);
    } finally {
      Cookies.remove(env.NEXT_PUBLIC_WIX_SESSION_COOKIE);
      window.location.href = "/";
    }
  }
  return { logout };
}
