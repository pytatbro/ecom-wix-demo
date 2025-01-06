"use client";

import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { ArrowRight, SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { products } from "@wix/stores";
import WixImg from "../WixImg";
import { cn } from "@/lib/utils";

export default function SearchBar({
  allProducts,
  className,
  isMobile = false,
}: {
  allProducts: products.Product[];
  className?: string;
  isMobile?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [moreThanMaxResult, setMoreThanMaxResult] = useState(false);
  const [maxResult, setMaxResult] = useState(6);
  const initialSearchResult = allProducts.slice(0, maxResult);
  const [searchResults, setSearchResults] = useState(initialSearchResult);

  useEffect(() => {
    const updateMaxResult = () => {
      setMaxResult(window.innerWidth < 768 ? 3 : 6);
    };

    updateMaxResult(); // Set initial maxResult based on screen size
    window.addEventListener("resize", updateMaxResult);

    return () => {
      window.removeEventListener("resize", updateMaxResult);
    };
  }, []);

  useEffect(() => {
    setSearchResults(allProducts.slice(0, maxResult));
    setMoreThanMaxResult(false);
  }, [maxResult, allProducts]);

  const fuse = new Fuse(allProducts, {
    keys: ["name", "description"],
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    if (value.length === 0) {
      setSearchResults(initialSearchResult);
      setMoreThanMaxResult(false);
      return;
    }

    const results = fuse.search(value);
    const items = results.map((result) => result.item);
    if (items.length > maxResult) {
      setSearchResults(items.slice(0, maxResult));
      setMoreThanMaxResult(true);
    } else {
      setSearchResults(items);
      setMoreThanMaxResult(false);
    }
  }
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (e.currentTarget.q as HTMLInputElement).value.trim();
    if (!q) return;
    setOpen(false);
    setSearchResults(initialSearchResult);
    setMoreThanMaxResult(false);
    router.push(`/store?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <Button
        variant={isMobile ? "ghost" : "outline"}
        className={cn("relative", className)}
        onClick={() => setOpen(true)}
      >
        <span className={isMobile ? "text-lg font-semibold" : "pe-8"}>
          Search
        </span>
        <SearchIcon
          className={cn(
            "absolute right-3 top-1/2 size-5 -translate-y-1/2 transform",
            isMobile && "hidden",
          )}
        />
      </Button>
      <Dialog
        open={open}
        onOpenChange={(open: boolean) => {
          setOpen(open);
          setSearchResults(initialSearchResult);
          setMoreThanMaxResult(false);
        }}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent shadow-none [&>button]:hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Dialog</DialogTitle>
            <DialogDescription>
              Type in the search bar to search for products
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSearch}
            className="mx-auto w-full space-y-5"
          >
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 transform" />
              <Input
                name="q"
                placeholder="Search product..."
                className="pe-20 ps-10"
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
              {searchResults?.map((product, index) => (
                <ProductPreview
                  product={product}
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    setSearchResults(initialSearchResult);
                    setMoreThanMaxResult(false);
                    router.push(`/products/${product.slug}`);
                  }}
                />
              ))}
            </div>
            {moreThanMaxResult && (
              <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-card py-2">
                <span>Showing the first {maxResult} results.</span>
                <Button
                  variant="link"
                  type="submit"
                  className="flex gap-1 px-0 text-base"
                >
                  View all <ArrowRight size={18} />
                </Button>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProductPreview({
  product,
  onClick,
}: {
  product: products.Product;
  onClick: () => void;
}) {
  const mImg = product.media?.mainMedia?.image;
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-lg border border-foreground bg-card p-2 md:flex-col md:p-4"
      onClick={onClick}
    >
      <div className="relative aspect-square w-24 overflow-hidden rounded-lg md:w-full">
        <WixImg
          mediaIdentifier={mImg?.url}
          alt={mImg?.altText}
          width={350}
          height={350}
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="w-full text-center text-sm">{product.name}</div>
    </div>
  );
}
