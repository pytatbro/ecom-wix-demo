import { WixClient } from "@/lib/wix-client.base";
import { getLoggedInMember } from "./members";
import { differenceInDays, format, isToday } from "date-fns";
import { reviews } from "@wix/reviews";

export interface CreateProductReviewValues {
  productId: string;
  title: string;
  body: string;
  rating: number;
  media: { url: string; type: "image" | "video" }[];
}

export async function createProductReview(
  wixClient: WixClient,
  { productId, title, body, rating, media }: CreateProductReviewValues,
) {
  const member = await getLoggedInMember(wixClient);
  if (!member) {
    throw new Error("You must be logged in to create a review");
  }
  const authorName =
    member.contact?.firstName && member.contact?.lastName
      ? `${member.contact.firstName} ${member.contact.lastName}`
      : member.contact?.firstName ||
        member.contact?.lastName ||
        member.profile?.nickname ||
        "Anonymous Member";
  const res = wixClient.reviews.createReview({
    author: {
      authorName,
      contactId: member.contactId,
    },
    entityId: productId,
    namespace: "stores",
    content: {
      title,
      body,
      rating,
      media: media.map(({ url, type }) =>
        type === "image" ? { image: url } : { video: url },
      ),
    },
  });
  console.log(res);
  return res;
}

interface GetProductReviewsFilters {
  productId: string;
  contactId?: string;
  limit?: number;
  cursor?: string | null;
}

export async function getProductReviews(
  wixClient: WixClient,
  { productId, contactId, limit, cursor }: GetProductReviewsFilters,
) {
  let query = wixClient.reviews.queryReviews().eq("entityId", productId);
  if (contactId) {
    // @ts-expect-error author.contactId not yet include in the type safety
    query = query.eq("author.contactId", contactId);
  }
  if (limit) {
    query = query.limit(limit);
  }
  if (cursor) {
    query = query.skipTo(cursor);
  }
  return query.find();
}

export function displayReviewDateText(date: Date | undefined) {
  if (!date) return null;
  let displayText = "";
  if (isToday(date)) {
    displayText = format(date, "hh:mm a");
  } else {
    const daysAgo = differenceInDays(new Date(), date);
    if (daysAgo <= 10) {
      displayText =
        daysAgo === 1 ? `${daysAgo} day ago` : `${daysAgo} days ago`;
    } else {
      displayText = format(date, "yyyy, MMM do");
    }
  }
  return displayText;
}

interface RatingByStarObject {
  [key: number]: number; // Key is a number (e.g., 1, 2, 3, 4, 5), value is the count
}

export interface ReviewStatsObject {
  avgRating: number;
  ratingByStar: RatingByStarObject;
  totalNumberOfReviews: number;
}

export function getReviewStats(reviews: reviews.Review[]): ReviewStatsObject {
  const noReview: ReviewStatsObject = {
    avgRating: 0,
    ratingByStar: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    totalNumberOfReviews: 0,
  };
  if (!reviews.length) return noReview;

  const ratings = reviews
    .map((review) => review.content?.rating)
    .filter((rating): rating is number => rating !== undefined);
  if (!ratings.length) return noReview;
  const totalNumberOfReviews = ratings.length;
  const avgRating =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  // Count occurrences of each rating (1 to 5)
  const ratingByStar = ratings.reduce(
    (acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
  );
  return {
    avgRating: parseFloat(avgRating.toFixed(1)),
    ratingByStar,
    totalNumberOfReviews,
  };
}
