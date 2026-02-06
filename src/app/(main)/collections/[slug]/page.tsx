import PaginationBar from "@/components/PaginationBar";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { delay, productsLimit } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug, getCollections } from "@/wix-api/collections";
import { fetchProducts } from "@/wix-api/products";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();
  const collectionSlugs = (await getCollections(wixServerClient)).map(
    (collection) => collection.slug,
  );
  if (!collectionSlugs.includes(slug)) notFound();
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

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();
  const collectionSlugs = (await getCollections(wixServerClient)).map(
    (collection) => collection.slug,
  );
  if (!collectionSlugs.includes(slug)) notFound();
  const { page } = await searchParams;
  const collection = await getCollectionBySlug(
    wixServerClient,
    slug,
  );
  if (!collection?._id) notFound();

  return (
    <section>
      <Suspense fallback={<LoadingSkeleton />} key={page}>
        <CollectionProducts
          collectionId={collection._id}
          collectionName={collection.name || "Products"}
          page={parseInt(page || "1")}
        />
      </Suspense>
    </section>
  );
}

async function CollectionProducts({
  collectionId,
  collectionName,
  page,
}: {
  collectionId: string;
  collectionName: string;
  page: number;
}) {
  // await delay(2000);
  const collectionProducts = await fetchProducts(await getWixServerClient(), {
    collectionIds: collectionId,
    limit: productsLimit,
    skip: (page - 1) * productsLimit,
  });
  if (!collectionProducts.items.length) notFound();
  if (page > (collectionProducts.totalPages || 1)) notFound();
  return (
    <div className="mx-auto max-w-7xl space-y-5 px-2 py-24 sm:px-5 2xl:max-w-screen-2xl">
      <h2 className="text-2xl font-bold">
        {collectionName}
        {" ("}
        {collectionProducts.totalCount}
        {")"}
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {collectionProducts.items.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <PaginationBar
        currentPage={page}
        totalPages={collectionProducts.totalPages || 1}
      />
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
