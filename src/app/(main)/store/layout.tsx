import { getWixServerClient } from "@/lib/wix-client.server";
import { getCollections } from "@/wix-api/collections";
import React from "react";
import FilterLayout from "./FilterLayout";

export default async function ProductResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collection = await getCollections(await getWixServerClient());
  return <FilterLayout collections={collection}>{children}</FilterLayout>;
}
