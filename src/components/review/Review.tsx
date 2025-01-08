import { cn } from "@/lib/utils";
import { displayReviewDateText } from "@/wix-api/reviews";
import { reviews } from "@wix/reviews";
import { CornerDownRight, StarIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import logo from "@/assets/logo.png";
import MediaAttachment from "./MediaAttachment";

export default function Review({
  review: { author, reviewDate, content, reply },
}: {
  review: reviews.Review;
}) {
  const ratingText = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="rounded-lg border bg-card px-6 py-8 shadow-xl">
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
          <div className="ms-5 space-y-2 sm:ms-10">
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
