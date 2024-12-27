"use client";

import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItemQuantity,
} from "@/hooks/use-cart";
import { currentCart } from "@wix/ecom";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  ArrowRight,
  Loader2,
  Minus,
  Plus,
  ShoppingCartIcon,
  Trash2,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Link from "next/link";
import WixImg from "../WixImg";
import { formatPrice } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function CartButton({
  initialData,
}: {
  initialData: currentCart.Cart | null;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const cartQuery = useCart(initialData);
  const number =
    cartQuery.data?.lineItems?.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0,
    ) || 0;

  return (
    <>
      <div className="relative">
        <Button variant="ghost" size="icon" onClick={() => setSheetOpen(true)}>
          <ShoppingCartIcon />
          <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-primary-foreground dark:bg-white">
            {number < 100 ? number : "99+"}
          </span>
        </Button>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-lg 2xl:max-w-xl">
          <SheetHeader>
            <SheetTitle className="text-center text-2xl font-bold lg:text-3xl">
              Your cart ({number} {number === 1 ? "item" : "items"})
            </SheetTitle>
          </SheetHeader>
          <div className="flex grow flex-col space-y-5 overflow-y-auto">
            <ul className="space-y-5">
              {cartQuery.data?.lineItems?.map((item) => (
                <ShoppingCartItem
                  key={item._id}
                  item={item}
                  currency={cartQuery.data?.conversionCurrency}
                  onProductClicked={() => setSheetOpen(false)}
                />
              ))}
            </ul>
            {cartQuery.isPending && (
              <Loader2 className="mx-auto animate-spin" />
            )}
            {cartQuery.error && (
              <p className="text-destructive">{cartQuery.error.message}</p>
            )}
            {!cartQuery.isPending && !cartQuery.data?.lineItems?.length && (
              <div className="flex grow items-center justify-center text-center">
                <div className="space-y-3">
                  <ShoppingCartIcon className="mx-auto" />
                  <p className="text-lg font-semibold">Your cart is empty</p>
                  <Button
                    size="lg"
                    className="flex gap-2 text-base lg:py-7 2xl:text-lg"
                    asChild
                  >
                    <Link href="/shop" onClick={() => setSheetOpen(false)}>
                      Start shopping now <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
          {cartQuery.data?.lineItems?.length ? (
            <>
              <Separator className="my-2" />
              <div className="flex items-center justify-between gap-5">
                <div className="space-y-0.5">
                  <p className="text-base 2xl:text-lg">Subtotal amount</p>
                  <p className="text-xl font-bold 2xl:text-2xl">
                    {/* @ts-expect-error Subtotal is not include in the type yet but actually have */}
                    {cartQuery.data?.subtotal?.formattedConvertedAmount}
                  </p>
                  <p className="text-sm text-muted-foreground 2xl:text-base">
                    Taxes not included
                  </p>
                </div>
                <Button
                  size="lg"
                  className="text-base 2xl:py-7 2xl:text-lg"
                  disabled={!number || cartQuery.isFetching}
                >
                  Checkout
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

interface ShoppingCartItemProps {
  item: currentCart.LineItem;
  currency?: string;
  onProductClicked: () => void;
}

function ShoppingCartItem({
  item,
  currency = "USD",
  onProductClicked,
}: ShoppingCartItemProps) {
  const updateQuantityMutation = useUpdateCartItemQuantity();
  const removeItemMutation = useRemoveCartItem();
  const productId = item._id;

  if (!productId) return null;

  const slug = item.url?.split("/").pop();

  const quantityLimitReached =
    !!item.quantity &&
    !!item.availability?.quantityAvailable &&
    item.quantity >= item.availability.quantityAvailable;

  return (
    <li className="flex items-start gap-5">
      <Link href={`/products/${slug}`} onClick={onProductClicked}>
        <WixImg
          mediaIdentifier={item.image}
          width={120}
          height={120}
          alt={item.productName?.translated || "Product image"}
          className="flex-none bg-secondary"
        />
      </Link>
      <div className="space-y-2.5 text-base">
        <div className="space-y-1">
          <Link
            href={`/products/${slug}`}
            className="hover:underline"
            onClick={onProductClicked}
          >
            <p className="font-bold">{item.productName?.translated}</p>
          </Link>
          {!!item.descriptionLines?.length &&
            item.descriptionLines.map((line, i) => (
              <p key={i}>
                {line.name?.translated}:{" "}
                {line.plainText?.translated || line.colorInfo?.translated}
              </p>
            ))}
          <div className="flex items-center gap-2 text-lg font-semibold">
            {formatPrice(
              Number(item.quantity) * Number(item.price?.convertedAmount),
              currency,
            )}
            {item.fullPrice && item.fullPrice.amount !== item.price?.amount && (
              <span className="font-normal text-muted-foreground line-through">
                {formatPrice(
                  Number(item.quantity) *
                    Number(item.fullPrice.convertedAmount),
                  currency,
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex w-fit items-center gap-1.5 rounded-md border border-input">
            <Button
              variant="ghost"
              size="icon"
              disabled={item.quantity === 1}
              onClick={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 0 : item.quantity - 1,
                })
              }
            >
              <Minus className="size-5" />
            </Button>
            <span className="text-lg">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              disabled={quantityLimitReached}
              onClick={() =>
                updateQuantityMutation.mutate({
                  productId,
                  newQuantity: !item.quantity ? 1 : item.quantity + 1,
                })
              }
            >
              <Plus className="size-5" />
            </Button>
          </div>
          <Button
            size="icon"
            variant="destructive"
            className="rounded-full"
            onClick={() => removeItemMutation.mutate(productId)}
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>
    </li>
  );
}
