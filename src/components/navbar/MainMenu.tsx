"use client";

import { collections } from "@wix/stores";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MainMenuProps {
  collections: collections.Collection[];
  className?: string;
}

export default function MainMenu({ collections, className }: MainMenuProps) {
  return (
    <NavigationMenu className={className}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/shop" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Shop
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="p-4">
              {collections.map((collection, i) => (
                <li key={i}>
                  <Link
                    href={`/collections/${collection.slug}`}
                    legacyBehavior
                    passHref
                  >
                    <NavigationMenuLink
                      className={cn(navigationMenuTriggerStyle(), "w-full justify-start whitespace-nowrap")}
                    >
                      {collection.name}
                    </NavigationMenuLink>
                  </Link>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
