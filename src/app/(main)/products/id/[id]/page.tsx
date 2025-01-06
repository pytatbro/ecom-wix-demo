import { getWixServerClient } from "@/lib/wix-client.server";
import { fetchSingleProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface ProductPageByIdProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ createReview?: string }>;
}

export default async function ProductPageById({
  params,
  searchParams,
}: ProductPageByIdProps) {
  const { id } = await params;
  if (id === "someId") {
    redirect(
      `/products/qleutech-coffee-mug?${new URLSearchParams(await searchParams)}`,
    );
  }
  const product = await fetchSingleProductById(await getWixServerClient(), id);
  if (!product) notFound();
  redirect(
    `/products/${product.slug}?${new URLSearchParams(await searchParams)}`,
  );
}
