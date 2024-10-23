import Image from "next/image";
import banner from "@/assets/banner.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { delay } from "@/lib/utils";
import { Suspense } from "react";
import { getWixClient } from "@/lib/wix-client.base";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollectionBySlug } from "@/wix-api/collections";
import { fetchProducts } from "@/wix-api/products";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl space-y-16 px-5 py-10 2xl:max-w-screen-2xl">
      <div className="flex items-center overflow-hidden rounded-2xl bg-secondary md:h-[27rem]">
        <div className="space-y-7 p-10 text-center md:w-1/2">
          <h1 className="text-3xl font-bold md:text-4xl">
            Lorem ipsum dolor sit amet consectetur
          </h1>
          <p className="mx-auto max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum
            quam earum magnam asperiores modi perferendis corporis debitis.
          </p>
          <Button asChild>
            <Link className="text-primary-foreground" href="/shop">
              Shop Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
        <div className="relative hidden h-full w-1/2 md:block">
          <Image
            src={banner}
            alt="QleuDemo banner"
            className="h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent" />
        </div>
      </div>
      <Suspense fallback={<LoadingSkeleton />}>
        <FeaturedProducts />
      </Suspense>
    </main>
  );
}

async function FeaturedProducts() {
  await delay(1000);

  const collection = await getCollectionBySlug("featured-products");
  if (!collection?._id) {
    return null;
  }
  const featuredProducts = await fetchProducts({
    collectionIds: collection._id,
    sort: "lastUpdated",
  });
  if (!featuredProducts.items.length) {
    return null;
  }
  return (
    <div className="space-y-6 md:space-y-10">
      <h2 className="text-2xl font-bold">Featured Products</h2>
      <div className="flex grid-cols-2 flex-col gap-6 sm:grid md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {featuredProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex grid-cols-2 flex-col gap-5 pt-12 sm:grid md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-[20rem] w-full" />
      ))}
    </div>
  );
}
