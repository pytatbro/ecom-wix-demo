import {
  BackInStockNotiRequestValues,
  createBackInStockNotiRequest,
} from "@/wix-api/backInStockNoti";
import { useToast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import { wixBrowserClient } from "@/lib/wix-client.browser";
import { isApplicationError } from "@/lib/applicationError";

export function useCreateBackInStockNotiRequest() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: BackInStockNotiRequestValues) =>
      createBackInStockNotiRequest(wixBrowserClient, values),
    onError(error) {
      console.error(error);
      if (
        isApplicationError(error) &&
        error.details.applicationError.code ===
          "BACK_IN_STOCK_NOTIFICATION_REQUEST_ALREADY_EXISTS"
      ) {
        toast({
          variant: "destructive",
          description: "You are already subscribed to this product.",
        });
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    },
  });
}
