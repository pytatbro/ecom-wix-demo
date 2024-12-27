import Link from "next/link";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import CartButton from "./CartButton";
import { getLoggedInMember } from "@/wix-api/members";
import UserButton from "../UserButton";
import { getCollections } from "@/wix-api/collections";
import MainMenu from "./MainMenu";

export default async function Navbar() {
  const wixServerClient = await getWixServerClient();
  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixServerClient),
    getLoggedInMember(wixServerClient),
    getCollections(wixServerClient),
  ]);

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5 min-[2000px]:max-w-[2000px]">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-start gap-3">
            <div className="text-2xl font-semibold 2xl:text-3xl">
              <span className="text-[#2173B1]">Qleu</span>
              <span className="text-[#F98E54]">Demo</span>
            </div>
          </Link>
          <MainMenu collections={collections} />
        </div>
        <div className="flex items-center justify-center gap-5">
          <UserButton loggedInMember={loggedInMember} />
          <CartButton initialData={cart} />
        </div>
      </div>
    </header>
  );
}
