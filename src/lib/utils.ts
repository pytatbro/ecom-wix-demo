import { products } from "@wix/stores";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPrice(
  price: number | string = 0,
  currency: string = "USD",
) {
  return Intl.NumberFormat("en", { style: "currency", currency }).format(
    Number(price),
  );
}

export function findVariant(
  product: products.Product,
  select: Record<string, string>,
) {
  return !product.manageVariants
    ? null
    : product.variants?.find((variant) => {
        return Object.entries(select).every(
          ([key, value]) => variant.choices?.[key] === value,
        );
      }) || null;
}

export function isInstock(
  product: products.Product,
  select: Record<string, string>,
) {
  const variant = findVariant(product, select);

  const checkInventoryStatus =
    product.stock?.inventoryStatus === products.InventoryStatus.IN_STOCK ||
    product.stock?.inventoryStatus ===
      products.InventoryStatus.PARTIALLY_OUT_OF_STOCK;

  return variant
    ? product.stock?.trackInventory
      ? variant.stock?.quantity !== 0 && variant.stock?.inStock
      : checkInventoryStatus
    : checkInventoryStatus;
}
