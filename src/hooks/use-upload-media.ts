import { useState } from "react";
import { useToast } from "./use-toast";
import ky from "ky";

export interface MediaAttachment {
  id: string;
  file: File;
  url?: string;
  state: "uploading" | "uploaded" | "failed" | "deleting";
}

export default function useUploadMedia() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  async function startUpload(files: File[]) {
    const newAttachments = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      state: "uploading" as const,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);

    const uploadPromises = newAttachments.map(async (attachment) => {
      try {
        const { uploadUrl } = await ky
          .get("/api/media/review", {
            searchParams: {
              fileName: attachment.file.name,
              mimeType: attachment.file.type,
            },
          })
          .json<{ uploadUrl: string }>();

        const {
          file: { url },
        } = await ky
          .put(uploadUrl, {
            timeout: false,
            body: attachment.file,
            headers: {
              "Content-Type": "application/octet-stream",
            },
            searchParams: {
              filename: attachment.file.name,
            },
          })
          .json<{ file: { url: string } }>();

        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id ? { ...a, state: "uploaded", url } : a,
          ),
        );
      } catch (error) {
        console.error(error);
        setAttachments((prev) =>
          prev.map((a) =>
            a.id === attachment.id ? { ...a, state: "failed" } : a,
          ),
        );
        toast({
          variant: "destructive",
          description: `Failed to upload the file ${attachment.file.name}`,
        });
      }
    });

    await Promise.all(uploadPromises);
  }
  async function removeAttachment(id: string) {
    const attachment = attachments.find((a) => a.id === id);
    if (!attachment?.url) return;

    // If the attachment has a 'failed' state, remove it locally
    if (attachment.state === "failed") {
      setAttachments((prev) => prev.filter((a) => a.id !== id));
      return;
    }

    setAttachments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, state: "deleting" } : a)),
    );
    try {
      await ky.delete("/api/media/review", {
        json: { ids: [attachment.url.split("media/")[1]] }, // extract id from url
      });

      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: `Failed to delete the file.`,
      });
    }
  }
  async function clearAllAttachments(alsoDeleteOnWix: boolean) {
    if (alsoDeleteOnWix) {
      // Filter out failed attachments and extract IDs for deletion
      const idsToDelete = attachments
        .filter((a) => a.state !== "failed") // Exclude failed attachments
        .map((a) => a.url?.split("media/")[1]) // Extract IDs from URLs
        .filter(Boolean) as string[];

      if (!idsToDelete.length) {
        // If no valid IDs, just clear failed attachments locally
        setAttachments((prev) => prev.filter((a) => a.state === "failed"));
        return;
      }

      setAttachments((prev) =>
        prev.map((a) =>
          idsToDelete.includes(a.url?.split("media/")[1] || "")
            ? { ...a, state: "deleting" }
            : a,
        ),
      );

      try {
        await ky.delete("/api/media/review", {
          json: { ids: idsToDelete },
        });

        setAttachments([]);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: `Failed to delete all files.`,
        });
      }
    } else {
      setAttachments([]);
    }
  }
  return { attachments, startUpload, removeAttachment, clearAllAttachments };
}
