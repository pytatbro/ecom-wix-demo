"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSortType } from "@/wix-api/products";
import { collections } from "@wix/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

interface FilterLayoutProps {
  collections: collections.Collection[];
  children: React.ReactNode;
}

export default function FilterLayout({
  collections,
  children,
}: FilterLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    collection: searchParams.getAll("collection"),
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sort: searchParams.get("sort") || undefined,
  });
  const [isPending, startTransition] = useTransition();

  function updateFilter(updates: Partial<typeof optimisticFilters>) {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });
    newSearchParams.delete("page");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  }

  return (
    <main className="group flex flex-col items-start justify-center px-5 py-12 lg:flex-row">
      <aside
        className="h-fit space-y-5 lg:sticky lg:top-10 lg:w-64"
        data-pending={isPending ? "" : undefined}
      >
        <SortFilter
          sort={optimisticFilters.sort}
          updateSort={(sort) => updateFilter({ sort })}
        />
        <CollectionFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.collection}
          updateCollectionIds={(collectionIds) =>
            updateFilter({ collection: collectionIds })
          }
        />
        <PriceFilter
          minDefault={optimisticFilters.minPrice}
          maxDefault={optimisticFilters.maxPrice}
          updatePriceRange={(min, max) =>
            updateFilter({ minPrice: min, maxPrice: max })
          }
        />
      </aside>
      {children}
    </main>
  );
}

interface CollectionFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

function CollectionFilter({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionFilterProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold uppercase">Collections</div>
      <ul className="space-y-1.5">
        {collections.map((collection) => {
          const collectionId = collection._id;
          if (!collectionId) return null;
          return (
            <li key={collectionId}>
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId,
                          ),
                    );
                  }}
                />
                <span>{collection.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => updateCollectionIds([])}
        >
          Reset
        </Button>
      )}
    </div>
  );
}

interface PriceFilterProps {
  minDefault: string | undefined;
  maxDefault: string | undefined;
  updatePriceRange: (min: string | undefined, max: string | undefined) => void;
}

function PriceFilter({
  minDefault,
  maxDefault,
  updatePriceRange,
}: PriceFilterProps) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  console.log(max);

  useEffect(() => {
    setMin(minDefault || "");
    setMax(maxDefault || "");
  }, [minDefault, maxDefault]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRange(min, max);
  }

  return (
    <div className="space-y-3">
      <div className="font-bold uppercase">Price Range</div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            name="min"
            placeholder="Min Price"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <Input
            type="number"
            name="max"
            placeholder="Max Price"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Apply
        </Button>
      </form>
      {(!!minDefault || !!maxDefault) && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => updatePriceRange(undefined, undefined)}
        >
          Reset
        </Button>
      )}
    </div>
  );
}

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (sort: ProductSortType) => void;
}

function SortFilter({ sort, updateSort }: SortFilterProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold uppercase">Sort by</div>
      <Select value={sort || "lastUpdated"} onValueChange={updateSort}>
        <SelectTrigger className="w-full gap-2 text-start">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lastUpdated">Newest</SelectItem>
          <SelectItem value="ascPrice">Price: Low to High</SelectItem>
          <SelectItem value="descPrice">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
