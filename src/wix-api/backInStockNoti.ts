import { env } from "@/env";
import { findVariant } from "@/lib/utils";
import { WixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";

export interface BackInStockNotiRequestValues {
  email: string;
  itemUrl: string;
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export async function createBackInStockNotiRequest(
  wixClient: WixClient,
  { email, itemUrl, product, selectedOptions }: BackInStockNotiRequestValues,
) {
  const selectedVariant = findVariant(product, selectedOptions);

  await wixClient.backInStockNotifications.createBackInStockNotificationRequest(
    {
      email,
      itemUrl,
      catalogReference: {
        appId: env.NEXT_PUBLIC_WIX_STORE_APP_ID_BACK_IN_STOCK_NOTI,
        catalogItemId: product._id,
        options: selectedVariant
          ? {
              variantId: selectedVariant._id,
            }
          : { options: selectedOptions },
      },
    },
    {
      name: product.name || undefined,
      price: product.priceData?.discountedPrice?.toFixed(2),
      image: product.media?.mainMedia?.image?.url,
    },
  );
}
