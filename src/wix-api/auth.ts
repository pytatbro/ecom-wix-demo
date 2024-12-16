import { WixClient } from "@/lib/wix-client.base";

export async function wixLogin(wixClient: WixClient) {
    const response = await wixClient.auth.login({
        email: 5,
        password: "<NEW_MEMBER_PASSWORD>",
      });
      
}