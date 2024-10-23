import { getWixClient } from "@/lib/wix-client.base";

type ProductSortType = "lastUpdated" | "ascPrice" | "descPrice";

interface ProductFilter {
  collectionIds?: string[] | string;
  sort?: ProductSortType;
}

export async function fetchProducts({
  collectionIds,
  sort = "lastUpdated",
}: ProductFilter) {
  const wixClient = getWixClient();
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
