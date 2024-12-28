import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { fetchProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );
  if (!collection) notFound();
  const banner = collection.media?.mainMedia?.image;
  return {
    title: collection.name,
    description: collection.description,
    openGraph: {
      images: banner ? [{ url: banner.url }] : [],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );
  if (!collection?._id) notFound();

  return (
    <section>
      <Suspense fallback={<LoadingSkeleton />}>
        <CollectionProducts
          collectionId={collection._id}
          collectionName={collection.name || "Products"}
        />
      </Suspense>
    </section>
  );
}

async function CollectionProducts({
  collectionId,
  collectionName,
}: {
  collectionId: string;
  collectionName: string;
}) {
  await delay(2000);
  const collectionProducts = await fetchProducts(await getWixServerClient(), {
    collectionIds: collectionId,
  });
  if (!collectionProducts.items.length) notFound();
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-2 py-24 sm:px-5 2xl:max-w-screen-2xl">
      <h2 className="text-2xl font-bold">
        {collectionName}
        {" ("}
        {collectionProducts.items.length}
        {")"}
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {collectionProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-2 py-24 sm:px-5 2xl:max-w-screen-2xl">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[13rem] w-full sm:h-[20rem]" />
        ))}
      </div>
    </div>
  );
}
