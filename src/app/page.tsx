import { delay } from "@/lib/utils";
import { Suspense } from "react";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollectionBySlug } from "@/wix-api/collections";
import { fetchProducts } from "@/wix-api/products";
import Slider from "@/components/Slider";
import MovingBrands from "@/components/MovingBrands";
import { getWixServerClient } from "@/lib/wix-client.server";

export default function Home() {
  return (
    <main>
      <Slider />
      <div className="mx-auto w-full space-y-16 sm:shadow-sm">
        <MovingBrands />
      </div>
      <div className="mx-auto max-w-7xl space-y-16 px-2 py-10 sm:px-5 2xl:max-w-screen-2xl">
        <Suspense fallback={<LoadingSkeleton />}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(2000);
  const wixServerClient = await getWixServerClient();
  const collection = await getCollectionBySlug(
    wixServerClient,
    "featured-products",
  );
  if (!collection?._id) {
    return null;
  }
  const featuredProducts = await fetchProducts(wixServerClient, {
    collectionIds: collection._id,
    sort: "lastUpdated",
  });
  if (!featuredProducts.items.length) {
    return null;
  }
  return (
    <div className="space-y-6 md:space-y-10">
      <h2 className="py-6 text-center text-3xl font-bold lg:text-5xl">
        Featured Products
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 pt-12 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[13rem] w-full sm:h-[20rem]" />
      ))}
    </div>
  );
}
