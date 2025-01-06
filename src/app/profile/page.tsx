import { getWixServerClient } from "@/lib/wix-client.server";
import { getLoggedInMember } from "@/wix-api/members";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import MemberContactInfoForm from "./MemberContactInfoForm";

export const metadata: Metadata = {
  title: "Profile",
  description: "This is your profile page",
};

export default async function ProfilePage() {
  const member = await getLoggedInMember(await getWixServerClient());
  if (!member) notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-16 px-2 py-10 sm:px-5 2xl:max-w-screen-2xl">
      <h1 className="text-center text-3xl font-bold lg:text-5xl">My Profile</h1>
      <MemberContactInfoForm member={member} />
    </main>
  );
}
