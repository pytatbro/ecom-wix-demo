import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { getCart } from "@/wix-api/cart";

export default async function Navbar() {
  const cart = await getCart();
  const number =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 p-5 2xl:max-w-screen-2xl">
        <Link href="/" className="flex items-start gap-3">
          <Image src={logo} alt="QleuDemo Logo" width={60} height={60} />
          <div className="mt-5 text-2xl font-semibold">
            <span className="text-[#2173B1]">Qleu</span>
            <span className="text-[#F98E54]">Demo</span>
          </div>
        </Link>
        {number} items in cart
      </div>
    </header>
  );
}
