import DiscountBadge from "@/components/DiscountBadge";
import { cn, formatPrice } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductPriceProps {
  product: products.Product;
  selectedVariant: products.Variant | null;
}

export default function ProductPrice({
  product,
  selectedVariant,
}: ProductPriceProps) {
  const priceData = selectedVariant?.variant?.priceData || product.priceData;

  if (!priceData) return null;
  const hasDiscount = priceData.discountedPrice !== priceData.price;

  return (
    <div className="flex items-center gap-2.5 text-3xl font-bold">
      {hasDiscount && (
        <span>
          {formatPrice(priceData.discountedPrice, priceData.currency)}
        </span>
      )}
      {priceData.price && (
        <span
          className={cn(
            hasDiscount &&
              "text-xl font-medium text-muted-foreground line-through",
          )}
        >
          {formatPrice(priceData.price, priceData.currency)}
        </span>
      )}
      {product.discount && (
        <DiscountBadge data={product.discount} curdata={priceData} />
      )}
    </div>
  );
}
