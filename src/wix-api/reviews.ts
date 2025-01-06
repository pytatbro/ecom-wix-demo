import { WixClient } from "@/lib/wix-client.base";
import { getLoggedInMember } from "./members";
import { differenceInDays, format, isToday } from "date-fns";

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
