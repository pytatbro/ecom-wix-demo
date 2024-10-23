import { products } from "@wix/stores";
import Link from "next/link";
import WixImg from "./WixImg";
import Badge from "./ui/badge";
import { formatPrice } from "@/lib/utils";
import DiscountBadge from "./DiscountBadge";

interface ProductProps {
  product: products.Product;
}

export default function Product({ product }: ProductProps) {
  const mImg = product.media?.mainMedia?.image;

  return (
    <Link href={`/products/${product.slug}`} className="h-full bg-card">
      <div className="relative overflow-hidden rounded-lg">
        <WixImg
          mediaIdentifier={mImg?.url}
          alt={mImg?.altText}
          width={700}
          height={700}
          className="transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute bottom-3 right-3 flex flex-wrap items-center gap-2">
          {product.ribbon && <Badge>{product.ribbon}</Badge>}
        </div>
      </div>
      <div className="space-y-3 pt-3">
        <h3 className="text-base font-bold">{product.name}</h3>
        <DisplayPrice product={product} />
        {product.discount && product.priceData && (
          <DiscountBadge data={product.discount} curdata={product.priceData} />
        )}
      </div>
    </Link>
  );
}

function DisplayPrice({ product }: ProductProps) {
  const min = product.priceRange?.minValue;
  const max = product.priceRange?.maxValue;
  const dis = product.priceData?.discountedPrice;
  const normalPrice = product.priceData?.price;
  const currency = product.priceData?.currency;

  if (min && max && min !== max) {
    return (
      <div>
        from{" "}
        {dis != min ? (
          <>
            <span className="font-semibold">{formatPrice(dis, currency)}</span>
            <span className="ml-1 font-light line-through">
              {formatPrice(min, currency)}
            </span>
          </>
        ) : (
          <span className="font-semibold">{formatPrice(min, currency)}</span>
        )}
      </div>
    );
  } else {
    return dis && normalPrice ? (
      dis !== normalPrice ? (
        <div className="flex gap-1">
          <span className="font-semibold">{formatPrice(dis, currency)}</span>
          <span className="font-light line-through">
            {formatPrice(normalPrice, currency)}
          </span>
        </div>
      ) : (
        <div className="font-semibold">
          {formatPrice(normalPrice, currency)}
        </div>
      )
    ) : (
      <div className="font-semibold">{"N/A"}</div>
    );
  }
}
