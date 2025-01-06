"use client";

import Badge from "@/components/ui/badge";
import { products } from "@wix/stores";
import ProductOptions from "./ProductOptions";
import { useState } from "react";
import { cn, findVariant, isInstock } from "@/lib/utils";
import ProductPrice from "./ProductPrice";
import ProductMedia from "./ProductMedia";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InfoIcon, Minus, Plus } from "lucide-react";
import sanitize from "sanitize-html";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddToCartButton from "@/components/AddToCartButton";
import BackInStockButton from "@/components/BackInStockButton";

interface ProductDetailsProps {
  product: products.Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [select, setSelect] = useState<Record<string, string>>(
    product.productOptions
      ?.map((option) => ({
        [option.name || ""]: option.choices?.[0].description || "",
      }))
      ?.reduce((acc, curr) => ({ ...acc, ...curr }), {}) || {},
  );

  const shortDesc = product.additionalInfoSections?.find(
    (item) =>
      item.title === "Short Description" || item.title === "shortDescription",
  );

  const selectedVariant = findVariant(product, select);

  const instock = isInstock(product, select);

  const availableQuantity =
    selectedVariant?.stock?.quantity ?? product.stock?.quantity;
  const quantityExceed = !!availableQuantity && quantity > availableQuantity;
  const quantityEqualMax = !!availableQuantity && quantity == availableQuantity;

  const handleQuantity = (type: "in" | "de") => {
    if (type === "de" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (
      type === "in" &&
      ((!!availableQuantity && quantity < availableQuantity) ||
        !availableQuantity)
    ) {
      setQuantity((prev) => prev + 1);
    }
  };

  const variantMedia = product.productOptions?.flatMap((option) => {
    const selectedChoice = option.choices?.find(
      (choice) => choice.description === select[option.name || ""],
    );
    return selectedChoice?.media?.items ?? [];
  });

  return (
    <div className="flex flex-col gap-10 md:flex-row lg:gap-20">
      <ProductMedia
        media={!!variantMedia?.length ? variantMedia : product.media?.items}
      />
      <div className="basis-1/2 space-y-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold lg:text-4xl">{product.name}</h1>
          {product.brand && (
            <div className="text-lg text-muted-foreground lg:text-base">
              {product.brand}
            </div>
          )}
          {product.ribbon && <Badge className="block">{product.ribbon}</Badge>}
        </div>
        <ProductPrice product={product} selectedVariant={selectedVariant} />
        {shortDesc && shortDesc.description && (
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(shortDesc.description),
            }}
            className="prose border-b-2 border-b-[bg-muted] pb-5 text-lg dark:prose-invert"
          />
        )}
        <ProductOptions
          product={product}
          select={select}
          setSelect={setSelect}
        />
        <div className="space-y-5 border-b-2 border-b-[bg-muted] pb-5">
          <div
            className={cn(
              "flex items-end gap-5",
              !instock && "flex-col items-start",
            )}
          >
            {instock ? (
              <>
                <div className="space-y-4">
                  <Label className="text-lg lg:text-xl" htmlFor="quantity">
                    Quantity
                  </Label>
                  <div className="flex w-fit items-center justify-between gap-3 rounded-3xl bg-muted px-4 py-2">
                    <button
                      className="cursor-pointer"
                      onClick={() => handleQuantity("de")}
                    >
                      <Minus
                        className={cn(
                          "size-5",
                          quantity == 1 && "cursor-not-allowed opacity-20",
                        )}
                      />
                    </button>
                    <Input
                      name="quantity"
                      type="number"
                      value={quantity === 0 ? "" : quantity}
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") setQuantity(1);
                      }}
                      className="w-9 border-none bg-muted text-center text-lg"
                      disabled={!instock}
                    />
                    <button
                      className="cursor-pointer"
                      onClick={() => handleQuantity("in")}
                    >
                      <Plus
                        className={cn(
                          "size-5",
                          (quantityEqualMax || quantityExceed) &&
                            "cursor-not-allowed opacity-20",
                        )}
                      />
                    </button>
                  </div>
                </div>
                <AddToCartButton
                  product={product}
                  selectedOptions={select}
                  quantity={quantity}
                  disabled={quantityExceed || quantity < 1}
                />
              </>
            ) : (
              <>
                <div className="text-lg font-medium">
                  Sorry, this item is currently out of stock
                </div>
                <BackInStockButton product={product} selectedOptions={select} />
              </>
            )}
          </div>
          {!!availableQuantity && availableQuantity < 10 && (
            <div className="text-base">
              Only{" "}
              <span className="text-destructive">
                {availableQuantity} items
              </span>{" "}
              left! {"Don't"} miss it!
            </div>
          )}
        </div>
        {/* {!!product.additionalInfoSections?.length && (
          <div className="space-y-5 text-lg text-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional product information</span>
            </span>
            <Accordion type="multiple">
              {product.additionalInfoSections
                .filter(
                  (item) =>
                    item.title !== "Short Description" &&
                    item.title !== "shortDescription",
                )
                .map((section) => (
                  <AccordionItem
                    value={section.title || ""}
                    key={section.title}
                  >
                    <AccordionTrigger className="font-semibold">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: sanitize(section.description || ""),
                        }}
                        className="prose text-lg text-foreground dark:prose-invert"
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        )} */}
        {!!product.additionalInfoSections?.length && (
          <div className="space-y-5 text-lg text-foreground">
            <span className="flex items-center gap-2">
              <InfoIcon className="size-5" />
              <span>Additional product information</span>
            </span>
            <Accordion type="multiple">
              {(() => {
                if (
                  product.description &&
                  !product.additionalInfoSections.some(
                    (section) => section.title === "Description",
                  )
                ) {
                  product.additionalInfoSections.unshift({
                    title: "Description",
                    description: product.description,
                  });
                }
                return product.additionalInfoSections
                  .filter(
                    (item) =>
                      item.title !== "Short Description" &&
                      item.title !== "shortDescription",
                  )
                  .map((section, index) => (
                    <AccordionItem value={section.title || ""} key={index}>
                      <AccordionTrigger className="font-semibold">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitize(section.description || ""),
                          }}
                          className="prose text-lg text-foreground dark:prose-invert"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ));
              })()}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
