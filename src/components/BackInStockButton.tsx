import { products } from "@wix/stores";
import { Button, ButtonProps } from "./ui/button";
import { useCreateBackInStockNotiRequest } from "@/hooks/use-back-in-stock";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./LoadingButton";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import { rainbowButtonClassName } from "./ui/rainbow-button";

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3, "Email must be at least 3 characters.")
    .email("Please type a valid email."),
});

interface BackInStockButtonProps extends ButtonProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
}

export default function BackInStockButton({
  product,
  selectedOptions,
  ...props
}: BackInStockButtonProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const mutation = useCreateBackInStockNotiRequest();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const email = values.email;
    mutation.mutate({
      email,
      itemUrl: env.NEXT_PUBLIC_BASE_URL + "/products/" + product.slug,
      product,
      selectedOptions,
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          {...props}
          className={cn(
            rainbowButtonClassName,
            "rounded-3xl p-7 text-lg lg:px-12 xl:px-16 xl:text-xl",
          )}
        >
          NOTIFY ME WHEN IT&apos;S BACK
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notify when available</DialogTitle>
          <DialogDescription>
            We&apos;ll let you know when this product is back in stock.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="youremail@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={mutation.isPending}>
              Submit
            </LoadingButton>
          </form>
        </Form>
        {mutation.isSuccess && (
          <div className="py-1 text-green-700">
            Thank you! We&apos;ll notify you when this product is back in stock.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
