"use client";

import LoadingButton from "@/components/LoadingButton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { displayReviewDateText, getProductReviews } from "@/wix-api/reviews";
import { useInfiniteQuery } from "@tanstack/react-query";
import { reviews } from "@wix/reviews";
import { products } from "@wix/stores";
import { CornerDownRight, PlayIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo.png";
import Zoom from "react-medium-image-zoom";
import WixImg from "@/components/WixImg";
import { media as wixMedia } from "@wix/sdk";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <div className="space-y-5">
      {/* {status === "pending" && LoadingSkeleton} */}
      {status === "error" && (
        <p className="text-destructive">An unexpected error occurred</p>
      )}
      {status === "success" && !reviewItem.length && !hasNextPage && (
        <p>No reviews yet</p>
      )}
      <div className="divide-y">
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

function Review({
  review: { author, reviewDate, content, reply },
}: {
  review: reviews.Review;
}) {
  const ratingText = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="rounded-lg border bg-card px-5 py-8 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold">
            {author?.authorName || "Anonymous"}
          </span>
          {reviewDate && (
            <span className="text-muted-foreground">
              {displayReviewDateText(new Date(reviewDate))}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={cn(
                  "size-5 text-[#FDCC0D]",
                  i < (content?.rating || 0) && "fill-[#FDCC0D]",
                )}
              />
            ))}
          </div>
          <span className="font-semibold text-primary">
            {content?.rating ? ratingText[content.rating - 1] : "No rating"}
          </span>
        </div>
        {content?.title && (
          <h3 className="text-base font-bold">{content.title}</h3>
        )}
        {content?.body && <p className="whitespace-pre-line">{content.body}</p>}
        {!!content?.media?.length && (
          <div className="flex flex-wrap gap-5 pt-2">
            {content.media.map((media, i) => (
              <MediaAttachment key={i} media={media} />
            ))}
          </div>
        )}
      </div>
      {reply?.message && (
        <>
          <Separator className="my-4 w-full" />
          <div className="ms-10 space-y-2">
            <div className="flex items-center gap-3">
              <CornerDownRight className="size-5" />
              <Image
                src={logo}
                alt="QleuDemo Team Logo"
                width={40}
                height={40}
                className="rounded-full border"
              />
              <span className="font-semibold">QleuDemo Team</span>
              {reply._updatedDate ? (
                <span className="text-muted-foreground">
                  {displayReviewDateText(new Date(reply._updatedDate))}
                </span>
              ) : reply._createdDate ? (
                <span className="text-muted-foreground">
                  {displayReviewDateText(new Date(reply._createdDate))}
                </span>
              ) : null}
            </div>
            <p className="whitespace-pre-line">{reply.message}</p>
          </div>
        </>
      )}
    </div>
  );
}

function MediaAttachment({ media }: { media: reviews.Media }) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (media.image) {
    return (
      <Zoom>
        <WixImg
          mediaIdentifier={media.image}
          alt="Review image"
          scaletofill={false}
          className="max-h-40 max-w-40 object-contain"
        />
      </Zoom>
    );
  }
  if (media.video) {
    const videoUrl = wixMedia.getVideoUrl(media.video).url;

    // Extract video thumbnail
    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.crossOrigin = "anonymous"; // Set if the video is hosted on a different domain
    videoElement.muted = true; // Necessary for some browsers when seeking programmatically

    // Wait for video metadata to load
    videoElement.addEventListener("loadeddata", () => {
      videoElement.currentTime = 1; // Seek to 1 second
    });

    // Once the seeked frame is loaded, capture it
    videoElement.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL("image/png"));
      }
      videoElement.remove(); // Cleanup
    });

    if (thumbnailUrl) {
      return (
        /* eslint-disable @next/next/no-img-element */
        <>
          <div
            className="relative size-fit"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={thumbnailUrl}
              alt="Video review thumbail"
              className="max-h-40 max-w-40 object-contain"
            />
            <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 outline outline-2 outline-white">
              <PlayIcon className="size-9 text-white" />
            </span>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="size-fit border-none bg-transparent shadow-none [&>button]:hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>User Product Review Video</DialogTitle>
                <DialogDescription>
                  This modal contains a video attacthment of a review of the
                  product.
                </DialogDescription>
              </DialogHeader>
              <video
                controls
                autoPlay
                className="m-auto max-h-[450px] max-w-[450px]"
              >
                <source src={videoUrl} />
              </video>
            </DialogContent>
          </Dialog>
        </>
      );
    } else {
      return null;
    }
  }
  return <span className="text-destructive">Unsupported media type</span>;
}
