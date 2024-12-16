import { Label } from "@/components/ui/label";
import { isInstock } from "@/lib/utils";
import { products } from "@wix/stores";

interface ProductOptionsProps {
  product: products.Product;
  select: Record<string, string>;
  setSelect: (options: Record<string, string>) => void;
}

export default function ProductOptions({
  product,
  select,
  setSelect,
}: ProductOptionsProps) {
  return (
    <div className="space-y-5">
      {product.productOptions?.map((option) => (
        <fieldset
          key={option.name}
          className="border-b-2 border-b-[bg-muted] py-5"
        >
          <legend>
            <Label className="text-lg lg:text-xl" asChild>
              <span>Select {option.name}</span>
            </Label>
          </legend>
          <div className="flex flex-wrap items-center gap-4">
            {option.choices?.map((choice) => (
              <div key={choice.description}>
                <input
                  type="radio"
                  id={choice.description}
                  name={option.name}
                  value={choice.description}
                  checked={select[option.name || ""] === choice.description}
                  onChange={() =>
                    setSelect({
                      ...select,
                      [option.name || ""]: choice.description || "",
                    })
                  }
                  className="peer hidden"
                />
                {option.optionType !== products.OptionType.color ? (
                  <Label
                    htmlFor={choice.description}
                    className="relative flex min-w-16 cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-muted p-3 transition-all duration-500 hover:bg-primary/20 peer-checked:bg-primary peer-checked:text-primary-foreground"
                  >
                    {choice.description}
                    {!isInstock(product, {
                      ...select,
                      [option.name || ""]: choice.description || "",
                    }) && (
                      <div className="absolute left-1/2 top-1/2 h-[2px] w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-red-400" />
                    )}
                  </Label>
                ) : (
                  <Label
                    htmlFor={choice.description}
                    className="relative block size-10 cursor-pointer rounded-full border-[1px] border-lime-950 transition-all duration-500 hover:outline-none hover:ring-4 hover:ring-primary/50 peer-checked:outline-none peer-checked:ring-4 peer-checked:ring-primary"
                    style={{ backgroundColor: choice.value }}
                  >
                    {!isInstock(product, {
                      ...select,
                      [option.name || ""]: choice.description || "",
                    }) && (
                      <div className="absolute left-1/2 top-1/2 h-[2px] w-14 -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-red-400" />
                    )}
                  </Label>
                )}
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
