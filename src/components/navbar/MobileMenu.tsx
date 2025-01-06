"use client";

import { members } from "@wix/members";
import { collections } from "@wix/stores";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { products } from "@wix/stores";
import { usePathname, useSearchParams } from "next/navigation";
import UserButton from "../UserButton";

interface MobileMenuProps {
  collections: collections.Collection[];
  loggedInMember: members.Member | null;
  allProducts: products.Product[];
}

export default function MobileMenu({
  collections,
  loggedInMember,
  allProducts,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathName, searchParams]);

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="inline-flex lg:hidden"
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="flex w-full items-center justify-center"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>
              Main navigation menu: Explore product categories, view offers, and
              access your account, cart, and support options.
            </SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col items-center">
            <ul className="space-y-5 text-center text-lg font-semibold">
              <li>
                <SheetClose asChild>
                  <Link href="/" className="hover:underline">
                    Home
                  </Link>
                </SheetClose>
              </li>
              <li>
                <Link href="/store" className="hover:underline">
                  Store
                </Link>
              </li>
              <li>
                <SearchBar
                  allProducts={allProducts}
                  isMobile
                  className="h-fit p-0 hover:underline"
                />
              </li>
              <li>
                <UserButton
                  loggedInMember={loggedInMember}
                  isMobile
                  className="h-fit p-0 text-lg font-semibold hover:underline"
                />
              </li>
              {collections.map((collection, index) => (
                <li key={index}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="hover:underline"
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
