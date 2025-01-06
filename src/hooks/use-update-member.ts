import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  updateMemberContactInfo,
  UpdateMemberContactInfoValues,
} from "@/wix-api/members";
import { wixBrowserClient } from "@/lib/wix-client.browser";

export function useUpdateMember() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (variables: UpdateMemberContactInfoValues) =>
      updateMemberContactInfo(wixBrowserClient, variables),
    onSuccess: () => {
      toast({
        description: "Your information has been successfully updated!",
      });
      setTimeout(() => {
        router.refresh();
      }, 2000);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description:
          "An error occurred while updating your info. Please try again later.",
      });
    },
  });
}
