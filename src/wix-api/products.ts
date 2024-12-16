import { WixClient } from "@/lib/wix-client.base";
import { cache } from "react";

type ProductSortType = "lastUpdated" | "ascPrice" | "descPrice";

interface ProductFilter {
  collectionIds?: string[] | string;
  sort?: ProductSortType;
}

export async function fetchProducts(
  wixClient: WixClient,
  { collectionIds, sort = "lastUpdated" }: ProductFilter,
) {
  let query = wixClient.products.queryProducts();
  const arr = collectionIds
    ? Array.isArray(collectionIds)
      ? collectionIds
      : [collectionIds]
    : [];
  if (arr.length > 0) {
    query = query.hasSome("collectionIds", arr);
  }
  switch (sort) {
    case "ascPrice":
      query = query.ascending("price");
      break;
    case "descPrice":
      query = query.descending("price");
      break;
    case "lastUpdated":
      query = query.descending("lastUpdated");
      break;
  }
  return query.find();
}

export const fetchSingleProduct = cache(
  async (wixClient: WixClient, slug: string) => {
    const { items } = await wixClient.products
      .queryProducts()
      .eq("slug", slug)
      .limit(1)
      .find();
    return !items[0] || !items[0].visible ? null : items[0];
  },
);
