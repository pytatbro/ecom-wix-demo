import { Skeleton } from "@/components/ui/skeleton";
import WixImg from "@/components/WixImg";
import { delay } from "@/lib/utils";
import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollectionBySlug } from "@/wix-api/collections";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface CollectionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default function CollectionLayout({
  children,
  params,
}: CollectionLayoutProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CollectionSection params={params}>{children}</CollectionSection>
    </Suspense>
  );
}

async function CollectionSection({ children, params }: CollectionLayoutProps) {
  await delay(2000);
  const { slug } = await params;
  const collection = await getCollectionBySlug(
    await getWixServerClient(),
    slug,
  );
  if (!collection) notFound();
  const banner = collection.media?.mainMedia?.image;

  return (
    <main>
      <section className="relative flex aspect-[5] w-full items-center justify-center py-10 lg:py-14">
        <div className="absolute left-0 top-0 -z-10 aspect-[5] w-full before:absolute before:z-10 before:block before:h-full before:w-full before:bg-black/60">
          {banner && (
            <WixImg
              mediaIdentifier={banner.url}
              alt={banner.altText}
              className="h-full w-full object-cover object-center"
              width={1920}
              height={384}
            />
          )}
        </div>
        <h1 className="text-center text-4xl font-semibold text-white xl:text-6xl 2xl:text-7xl">
          {collection.name}
        </h1>
      </section>
      {children}
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main>
      <section>
        <Skeleton className="aspect-[5] w-full rounded-none py-10 lg:py-14" />
        <div className="mx-auto max-w-7xl space-y-5 px-2 py-24 sm:px-5 2xl:max-w-screen-2xl">
          <Skeleton className="h-8 w-56" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[13rem] w-full sm:h-[20rem]" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
