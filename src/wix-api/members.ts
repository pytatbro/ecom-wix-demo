import { WixClient } from "@/lib/wix-client.base";
import { members } from "@wix/members";
import { cache } from "react";

export const getLoggedInMember = cache(
  async (wixClient: WixClient): Promise<members.Member | null> => {
    if (!wixClient.auth.loggedIn()) {
      return null;
    }
    const memberData = await wixClient.members.getCurrentMember({
      fieldsets: [members.Set.FULL],
    });
    return memberData.member || null;
  },
);

export interface UpdateMemberContactInfoValues {
  firstName: string;
  lastName: string;
  birthdate: string;
}

export async function updateMemberContactInfo(
  wixClient: WixClient,
  { firstName, lastName, birthdate }: UpdateMemberContactInfoValues,
) {
  const member = await getLoggedInMember(wixClient);
  if (!member?._id) {
    throw new Error("Member is not logged in");
  }
  return wixClient.members.updateMember(member._id, {
    contact: { firstName, lastName, birthdate },
  });
}
