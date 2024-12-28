import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

export const getCollectionBySlug = cache(
  async (wixClient: WixClient, slug: string) => {
    const { collection } =
      await wixClient.collections.getCollectionBySlug(slug);
    return collection || null;
  },
);

export const getCollections = cache(async (wixClient: WixClient) => {
  const collections = await wixClient.collections
    .queryCollections()
    .ne("_id", "00000000-000000-000000-000000000001") // exclude All Products
    .ne("_id", "14022804-27ce-e03d-e03c-b978e8d428a5") // exclude Featured Products
    .find();
  return collections.items;
});
