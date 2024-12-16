import { products } from "@wix/stores";
import { ButtonProps } from "./ui/button";
import { rainbowButtonClassName } from "./ui/rainbow-button";
import LoadingButton from "./LoadingButton";
import { cn } from "@/lib/utils";
import { useAddItemToCart } from "@/hooks/use-cart";

interface AddToCartButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  quantity: number;
}

export default function AddToCartButton({
  product,
  selectedOptions,
  quantity,
  className,
  ...props
}: AddToCartButtonProps) {
  const mutation = useAddItemToCart();
  return (
    <LoadingButton
      onClick={() => mutation.mutate({ product, selectedOptions, quantity })}
      className={cn(
        rainbowButtonClassName,
        "rounded-3xl px-8 py-7 text-lg lg:px-12 xl:px-24 xl:text-xl",
        className,
      )}
      loading={mutation.isPending}
      {...props}
    >
      ADD TO CART
    </LoadingButton>
  );
}
