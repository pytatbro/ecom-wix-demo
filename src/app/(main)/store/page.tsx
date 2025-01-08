import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { searchResults } from "@/lib/fuse";
import { delay, paginateArray, productsLimit } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import {
  fetchProducts,
  ProductSortType,
  sortProductsAfterSearch,
} from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EmptySvg from "../../../components/EmptySvg";

interface ProductResultPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    collection?: string[];
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProductResultPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for ${q}` : "All products",
  };
}

export default async function ProductResultPage({
  searchParams,
}: ProductResultPageProps) {
  const {
    q,
    page,
    collection: collectionIds,
    minPrice,
    maxPrice,
    sort,
  } = await searchParams;
  const title = q ? `Search results for "${q}"` : "All products";

  return (
    <section className="w-full">
      <h1 className="pb-5 pt-6 text-center text-3xl font-bold lg:text-5xl">
        {title}
      </h1>
      <Suspense fallback={<LoadingSkeleton />} key={`${q}-${page}`}>
        <ProductResult
          q={q}
          page={parseInt(page || "1")}
          collectionIds={collectionIds}
          minPrice={minPrice ? parseInt(minPrice) : undefined}
          maxPrice={maxPrice ? parseInt(maxPrice) : undefined}
          sort={sort as ProductSortType}
        />
      </Suspense>
    </section>
  );
}

interface ProductResultProps {
  q?: string;
  collectionIds?: string[];
  page: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSortType;
}

async function ProductResult({
  q,
  page,
  collectionIds,
  minPrice,
  maxPrice,
  sort,
}: ProductResultProps) {
  await delay(2000);
  let products;
  if (q) {
    const beforeSearch = await fetchProducts(await getWixServerClient(), {
      collectionIds,
      minPrice,
      maxPrice,
    });
    const searchedProducts = searchResults(
      beforeSearch.items,
      ["name", "description"],
      q,
    );
    const sortedProducts = sortProductsAfterSearch(searchedProducts, sort);
    products = paginateArray(!!sort ? searchedProducts : sortedProducts, {
      limit: productsLimit,
      skip: (page - 1) * productsLimit,
    });
  } else {
    products = await fetchProducts(await getWixServerClient(), {
      limit: productsLimit,
      skip: (page - 1) * productsLimit,
      collectionIds,
      minPrice,
      maxPrice,
      sort,
    });
  }
  if (page > (products.totalPages || 1)) notFound();
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-2 pb-10 group-has-[[data-pending]]:animate-pulse sm:px-5 2xl:max-w-screen-2xl">
      <p className="text-center text-lg">
        {products.totalCount === 0 ? "No" : products.totalCount}{" "}
        {products.totalCount === 0 || products.totalCount === 1
          ? "product"
          : "products"}{" "}
        found
      </p>
      {products.totalCount !== 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
          {products.items.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mx-auto flex w-fit flex-col items-center justify-center gap-10">
          <EmptySvg className="h-[180px] w-[240.75px] fill-muted-foreground" />
          <p className="text-muted-foreground">
            Wow, such an empty! Try using a different term.
          </p>
        </div>
      )}
      <PaginationBar currentPage={page} totalPages={products.totalPages || 1} />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-16 px-2 pb-10 sm:px-5 2xl:max-w-screen-2xl">
      <Skeleton className="mx-auto h-7 w-48" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[13rem] w-full sm:h-[20rem]" />
        ))}
      </div>
    </div>
  );
}
