import { fetchSingleProduct, getRelatedProducts } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wix-client.server";
import { Suspense } from "react";
import { delay } from "@/lib/utils";
import Product from "@/components/Product";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@wix/stores";
import { getLoggedInMember } from "@/wix-api/members";
import CreateReviewButton from "@/components/review/CreateReviewButton";
import ProductReviews, {
  ProductReviewsLoadingSkeleton,
} from "./ProductReviews";
import { getProductReviews, getReviewStats } from "@/wix-api/reviews";
import ReviewStats, {
  ReviewStatsLoadingSkeleton,
} from "@/components/review/ReviewStats";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();

  const product = await fetchSingleProduct(wixServerClient, slug);
  if (!product?._id) notFound();
  const mainImg = product.media?.mainMedia?.image;
  return {
    title: product.name,
    description: "Get this product on QleuDemo store!",
    openGraph: {
      images: mainImg?.url
        ? [
            {
              url: mainImg.url,
              width: mainImg.width,
              height: mainImg.height,
              alt: mainImg.altText || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  await delay(3000);
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();

  const product = await fetchSingleProduct(wixServerClient, slug);
  if (!product?._id) notFound();
  return (
    <main className="mx-auto max-w-7xl space-y-24 px-5 py-10 2xl:max-w-screen-2xl">
      <ProductDetails product={product} />
      <Suspense fallback={<RelatedSectionLoadingSkeleton />}>
        <RelatedProducts productId={product._id} />
      </Suspense>
      <div className="space-y-5">
        <h2 className="pb-6 text-center text-3xl font-bold lg:text-4xl">
          Reviews
        </h2>
        <Suspense fallback={<ProductReviewsSectionLoadingSkeleton />}>
          <ProductReviewsSection product={product} />
        </Suspense>
      </div>
    </main>
  );
}

interface RelatedProductsProps {
  productId: string;
}

async function RelatedProducts({ productId }: RelatedProductsProps) {
  await delay(2000);
  const relatedProducts = await getRelatedProducts(
    await getWixServerClient(),
    productId,
  );

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="pb-6 text-center text-3xl font-bold lg:text-4xl">
        Related Products
      </h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {relatedProducts.map((product, index) => (
          <Product key={index} product={product} />
        ))}
      </div>
    </div>
  );
}

function RelatedSectionLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="mx-auto h-9 w-60 pb-6 lg:h-10 lg:w-72" />
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[13rem] w-full sm:h-[20rem]" />
        ))}
      </div>
    </div>
  );
}

interface ProductReviewsProps {
  product: products.Product;
}

async function ProductReviewsSection({ product }: ProductReviewsProps) {
  if (!product._id) return null;

  const wixClient = await getWixServerClient();
  const loggedInMember = await getLoggedInMember(wixClient);
  const existingReview = loggedInMember?.contactId
    ? (
        await getProductReviews(wixClient, {
          productId: product._id,
          contactId: loggedInMember.contactId,
        })
      ).items[0]
    : null;
  await delay(5000);

  const allReviews = await getProductReviews(wixClient, {
    productId: product._id,
  });
  const reviewStat = getReviewStats(allReviews.items);
  return (
    <div className="flex w-full flex-col justify-center gap-14 max-lg:items-center lg:flex-row lg:gap-10">
      <div className="h-fit w-full max-w-sm space-y-5 lg:sticky lg:top-10 lg:basis-1/4">
        <ReviewStats
          avgRating={reviewStat.avgRating}
          ratingByStar={reviewStat.ratingByStar}
          totalNumberOfReviews={reviewStat.totalNumberOfReviews}
        />
        <CreateReviewButton
          product={product}
          loggedInMember={loggedInMember}
          memberAlreadyReviewed={!!existingReview}
        />
      </div>
      <ProductReviews product={product} />
    </div>
  );
}

function ProductReviewsSectionLoadingSkeleton() {
  return (
    <div className="flex w-full flex-col justify-center gap-14 max-lg:items-center lg:flex-row lg:gap-10">
      <div className="h-fit w-full max-w-sm space-y-5 lg:sticky lg:top-10 lg:basis-1/4">
        <ReviewStatsLoadingSkeleton />
      </div>
      <ProductReviewsLoadingSkeleton />
    </div>
  );
}
