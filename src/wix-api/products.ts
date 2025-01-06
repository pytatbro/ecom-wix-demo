import { env } from "@/env";
import { WixClient } from "@/lib/wix-client.base";
import { products } from "@wix/stores";
import { cache } from "react";

export type ProductSortType = "lastUpdated" | "ascPrice" | "descPrice";

interface ProductFilter {
  collectionIds?: string[] | string;
  sort?: ProductSortType;
  skip?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}

export async function fetchProducts(
  wixClient: WixClient,
  {
    collectionIds,
    sort = "lastUpdated",
    skip,
    limit,
    minPrice,
    maxPrice,
  }: ProductFilter,
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
  if (minPrice) query = query.ge("priceData.price", minPrice);
  if (maxPrice) query = query.le("priceData.price", maxPrice);
  if (limit) query = query.limit(limit);
  if (skip) query = query.skip(skip);
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

export async function fetchSingleProductById(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.products.getProduct(productId);
  return result.product;
}

export function sortProductsAfterSearch(
  products: products.Product[],
  sort: ProductSortType = "lastUpdated",
) {
  return products.sort((a, b) => {
    switch (sort) {
      case "ascPrice": {
        const priceA = a.priceData?.price ?? Infinity;
        const priceB = b.priceData?.price ?? Infinity;
        return priceA - priceB;
      }
      case "descPrice": {
        const priceA = a.priceData?.price ?? -Infinity;
        const priceB = b.priceData?.price ?? -Infinity;
        return priceB - priceA;
      }
      case "lastUpdated":
      default: {
        const dateA = a.lastUpdated
          ? new Date(a.lastUpdated).getTime()
          : -Infinity;
        const dateB = b.lastUpdated
          ? new Date(b.lastUpdated).getTime()
          : -Infinity;
        return dateB - dateA;
      }
    }
  });
}

export async function getRelatedProducts(
  wixClient: WixClient,
  productId: string,
) {
  const result = await wixClient.recommendations.getRecommendation(
    [
      {
        _id: env.NEXT_PUBLIC_BOUGHT_TOGETHER_ALGORITHM_ID, // Frequently bought together
        appId: env.NEXT_PUBLIC_WIX_STORE_APP_ID,
      },
      {
        _id: env.NEXT_PUBLIC_SAME_CATEGORY_ALGORITHM_ID, // Same category
        appId: env.NEXT_PUBLIC_WIX_STORE_APP_ID,
      },
    ],
    {
      items: [
        {
          appId: env.NEXT_PUBLIC_WIX_STORE_APP_ID,
          catalogItemId: productId,
        },
      ],
      minimumRecommendedItems: 3,
    },
  );

  const productIdList = result.recommendation?.items
    .map((item) => item.catalogItemId)
    .filter((id) => id !== undefined);

  if (!productIdList || !productIdList.length) return [];

  const productResult = await wixClient.products
    .queryProducts()
    .in("_id", productIdList)
    .limit(4)
    .find();

  return productResult.items;
}
