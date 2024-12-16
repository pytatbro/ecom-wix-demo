import { fetchSingleProduct } from "@/wix-api/products";
import { notFound } from "next/navigation";
import ProductDetails from "./ProductDetails";
import { Metadata } from "next";
import { getWixServerClient } from "@/lib/wix-client.server";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();

  const product = await fetchSingleProduct(wixServerClient, slug);
  if (!product?._id) notFound();
  const mainImg = product.media?.mainMedia?.image;
  return {
    title: product.name,
    description: "Get this product on QleuDemo store!",
    openGraph: {
      images: mainImg?.url
        ? [
            {
              url: mainImg.url,
              width: mainImg.width,
              height: mainImg.height,
              alt: mainImg.altText || "",
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const wixServerClient = await getWixServerClient();

  const product = await fetchSingleProduct(wixServerClient, slug);
  if (!product?._id) notFound();
  return (
    <main className="mx-auto max-w-7xl space-y-14 px-5 py-10 2xl:max-w-screen-2xl">
      <ProductDetails product={product} />
    </main>
  );
}
