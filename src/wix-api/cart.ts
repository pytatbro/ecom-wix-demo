import { getWixClient } from "@/lib/wix-client.base";

export async function getCart() {
  const wixclient = getWixClient();
  try {
    return await wixclient.currentCart.getCurrentCart();
  } catch (error) {
    if (
      (error as any).details.applicationError.code === "OWNED_CART_NOT_FOUND"
    ) {
      return null;
    } else {
      throw error;
    }
  }
}
