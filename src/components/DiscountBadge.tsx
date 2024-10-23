import { products } from "@wix/stores";
import Badge from "./ui/badge";
import { formatPrice } from "@/lib/utils";

interface DiscountBadgeProps {
  data: products.Discount;
  curdata: products.PriceData;
}

export default function DiscountBadge({ data, curdata }: DiscountBadgeProps) {
  return data.type !== "NONE" ? (
    <Badge className="block">
      {data.type === "PERCENT"
        ? `${data.value}%`
        : formatPrice(data.value, curdata.currency)}{" "}
      OFF
    </Badge>
  ) : null;
}
