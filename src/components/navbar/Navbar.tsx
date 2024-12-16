import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import CartButton from "./CartButton";

export default async function Navbar() {
  const wixServerClient = await getWixServerClient();
  const cart = await getCart(wixServerClient);
  
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5 min-[2000px]:max-w-[2000px]">
        <Link href="/" className="flex items-start gap-3">
          <div className="text-2xl font-semibold 2xl:text-3xl">
            <span className="text-[#2173B1]">Qleu</span>
            <span className="text-[#F98E54]">Demo</span>
          </div>
        </Link>
        <CartButton initialData={cart} />
      </div>
    </header>
  );
}
