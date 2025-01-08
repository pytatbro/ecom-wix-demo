"use client";

import LoadingButton from "@/components/LoadingButton";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { getProductReviews } from "@/wix-api/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import Review from "@/components/review/Review";
import { Skeleton } from "@/components/ui/skeleton";
import EmptySvg from "@/components/EmptySvg";

interface ProductReviewsProps {
  product: products.Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["product-reviews", product._id],
      queryFn: async ({ pageParam }) => {
        if (!product._id) {
          throw new Error("Product ID is missing");
        }
        const pageSize = 3; // can change later
        return getProductReviews(wixBrowserClient, {
          productId: product._id,
          limit: pageSize,
          cursor: pageParam,
        });
      },
      select: (data) => ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter(
            (item) =>
              item.moderation?.moderationStatus ===
              reviews.ModerationModerationStatus.APPROVED,
          ),
        })),
      }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.cursors.next,
    });

  const reviewItem = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="space-y-5 max-lg:max-w-xl lg:basis-3/4">
      {status === "pending" && <ProductReviewsLoadingSkeleton />}
      {status === "error" && (
        <p className="text-destructive">An unexpected error occurred</p>
      )}
      {status === "success" && !reviewItem.length && !hasNextPage && (
        <div className="mx-auto flex h-full w-fit flex-col items-center justify-center gap-10">
          <EmptySvg className="h-[120px] w-[160.5px] fill-muted-foreground" />
          <p className="text-muted-foreground">
            Wow, such an empty. Leave a review now!
          </p>
        </div>
      )}
      <div className="space-y-8 divide-y">
        {reviewItem.map((review, index) => (
          <Review key={index} review={review} />
        ))}
      </div>
      {hasNextPage && (
        <LoadingButton
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          View more
        </LoadingButton>
      )}
    </div>
  );
}

export function ProductReviewsLoadingSkeleton() {
  return (
    <div className="space-y-5 max-lg:max-w-xl lg:basis-3/4">
      <div className="space-y-8 divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    </div>
  );
}
