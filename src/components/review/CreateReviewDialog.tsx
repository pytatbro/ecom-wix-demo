import { products } from "@wix/stores";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProductReview } from "@/hooks/use-create-review";
import { Label } from "../ui/label";
import WixImg from "../WixImg";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import LoadingButton from "../LoadingButton";
import { Textarea } from "../ui/textarea";
import RatingInput from "./RatingInput";
import { useRef } from "react";
import { Button } from "../ui/button";
import { CircleAlert, CloudUpload, Loader2, X } from "lucide-react";
import useUploadMedia, { MediaAttachment } from "@/hooks/use-upload-media";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Please rate this product.")
    .max(5, "Rating must be at most 5."),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must be at most 100 characters.")
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, "Message must be at least 3 characters.")
    .max(3000, "Message must be at most 100 characters.")
    .or(z.literal("")),
});

interface CreateReviewDialogProps {
  product: products.Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export default function CreateReviewDialog({
  product,
  open,
  onOpenChange,
  onSubmitted,
}: CreateReviewDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      title: "",
      body: "",
    },
  });
  const mutation = useCreateProductReview();
  const router = useRouter();

  const { attachments, startUpload, removeAttachment, clearAllAttachments } =
    useUploadMedia();

  async function onSubmit({ title, body, rating }: z.infer<typeof formSchema>) {
    if (!product._id) {
      throw new Error("Product ID is missing");
    }
    mutation.mutate(
      {
        productId: product._id,
        title,
        body,
        rating,
        media: attachments
          .filter((m) => m.url)
          .map((m) => ({
            url: m.url!,
            type: m.file.type.startsWith("image") ? "image" : "video",
          })),
      },
      {
        onSuccess: () => {
          form.reset();
          clearAllAttachments(false);
          onSubmitted();
          setTimeout(() => {
            router.refresh();
          }, 2000);
        },
      },
    );
  }

  const uploadInProgress = attachments.some((m) => m.state === "uploading");
  const deleteInProgress = attachments.some((m) => m.state === "deleting");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="pl-2 pr-4">
          <DialogTitle>Leave a review</DialogTitle>
          <DialogDescription>
            What did you think of this product?
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[600px] w-full">
          <div className="space-y-5 pl-2 pr-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <div className="flex items-center gap-5">
                <WixImg
                  mediaIdentifier={product.media?.mainMedia?.image?.url}
                  width={70}
                  height={70}
                  className="rounded-lg"
                />
                <div className="space-y-0.5">
                  <div className="font-bold">{product.name}</div>
                  {product.brand && (
                    <div className="text-muted-foreground">{product.brand}</div>
                  )}
                </div>
              </div>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Rating <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RatingInput
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell others about your thoughts..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Let others know what you liked, what could be improved,
                        or anything else about your experience with the product
                        or service!
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <Label htmlFor="attach-file">Attach media</Label>
                  <div className="flex items-center space-x-2">
                    <AddMediaButton
                      onFileSelected={(files) => startUpload(files)}
                      disabled={
                        attachments.filter((a) => a.state !== "failed")
                          .length >= 5
                      }
                      maxFiles={5}
                      currentAttachments={
                        attachments.filter((a) => a.state !== "failed").length
                      }
                    />
                    {!!attachments.length && (
                      <Button
                        variant="destructive"
                        size="sm"
                        title="Clear all attachments"
                        type="button"
                        onClick={() => clearAllAttachments(true)}
                        disabled={uploadInProgress || deleteInProgress}
                      >
                        Clear all
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-5">
                    {attachments.map((attachment) => (
                      <AttachmentPreview
                        key={attachment.id}
                        attachment={attachment}
                        onRemoveClick={removeAttachment}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <LoadingButton
                    type="submit"
                    loading={mutation.isPending}
                    disabled={uploadInProgress || deleteInProgress}
                  >
                    Submit
                  </LoadingButton>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={uploadInProgress || deleteInProgress}
                    onClick={() => {
                      onOpenChange(false);
                      form.reset();
                      clearAllAttachments(true);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface AddMediaButtonProps {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
  maxFiles: number;
  currentAttachments: number;
}

function AddMediaButton({
  onFileSelected,
  disabled,
  maxFiles = 5,
  currentAttachments,
}: AddMediaButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        title="Add media"
        type="button"
        className="gap-2"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <CloudUpload size={18} />
        <span>Upload</span>
      </Button>
      <input
        id="attach-file"
        type="file"
        accept="image/*, video/*"
        ref={fileInputRef}
        multiple
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          const remainingSlots = maxFiles - currentAttachments;
          if (files.length > remainingSlots) {
            alert(
              `You can only upload up to ${remainingSlots} more file(s). Please select fewer files.`,
            );
            e.target.value = ""; // Clear the input
            return;
          }
          if (files.length) {
            onFileSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: MediaAttachment;
  onRemoveClick: (id: string) => void;
}

function AttachmentPreview({
  attachment: { id, file, state, url },
  onRemoveClick,
}: AttachmentPreviewProps) {
  return (
    <div
      className={cn(
        "group relative size-fit hover:opacity-70",
        state === "failed" && "outline outline-1 outline-destructive",
      )}
    >
      {file.type.startsWith("image") ? (
        <WixImg
          mediaIdentifier={url}
          scaletofill={false}
          placeholder={URL.createObjectURL(file)}
          alt="Attachment preview"
          className={cn(
            "max-h-24 max-w-24 object-contain",
            (!url || state === "deleting") && "opacity-50",
          )}
        />
      ) : (
        <video
          controls
          className={cn(
            "max-h-24 max-w-24 object-contain",
            (!url || state === "deleting") && "opacity-50",
          )}
        >
          <source src={url || URL.createObjectURL(file)} type={file.type} />
        </video>
      )}
      {(state === "uploading" || state === "deleting") && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "failed" && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
          title="Failed to upload media"
        >
          <CircleAlert className="text-destructive" />
        </div>
      )}
      {state === "uploaded" && (
        <button
          title="Remove attachment"
          type="button"
          onClick={() => onRemoveClick(id)}
          className="absolute -right-2 -top-2 size-5 rounded-full border bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-white"
        >
          <X size={15} className="m-auto text-white dark:text-black" />
        </button>
      )}
    </div>
  );
}
