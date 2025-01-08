import { reviews } from "@wix/reviews";
import { useState } from "react";
import WixImg from "../WixImg";
import Zoom from "react-medium-image-zoom";
import { media as wixMedia } from "@wix/sdk";
import { PlayIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export default function MediaAttachment({ media }: { media: reviews.Media }) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (media.image) {
    return (
      <Zoom>
        <WixImg
          mediaIdentifier={media.image}
          alt="Review image"
          scaletofill={false}
          className="max-h-40 max-w-40 object-contain"
        />
      </Zoom>
    );
  }
  if (media.video) {
    const videoUrl = wixMedia.getVideoUrl(media.video).url;

    // Extract video thumbnail
    const videoElement = document.createElement("video");
    videoElement.src = videoUrl;
    videoElement.crossOrigin = "anonymous"; // Set if the video is hosted on a different domain
    videoElement.muted = true; // Necessary for some browsers when seeking programmatically

    // Wait for video metadata to load
    videoElement.addEventListener("loadeddata", () => {
      videoElement.currentTime = 1; // Seek to 1 second
    });

    // Once the seeked frame is loaded, capture it
    videoElement.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        setThumbnailUrl(canvas.toDataURL("image/png"));
      }
      videoElement.remove(); // Cleanup
    });

    if (thumbnailUrl) {
      return (
        <>
          <div
            className="relative size-fit"
            onClick={() => setIsModalOpen(true)}
          >
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt="Video review thumbail"
              className="max-h-40 max-w-40 object-contain"
            />
            <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 outline outline-2 outline-white">
              <PlayIcon className="size-9 text-white" />
            </span>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="size-fit border-none bg-transparent shadow-none [&>button]:hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>User Product Review Video</DialogTitle>
                <DialogDescription>
                  This modal contains a video attacthment of a review of the
                  product.
                </DialogDescription>
              </DialogHeader>
              <video
                controls
                autoPlay
                className="m-auto max-h-[450px] max-w-[450px]"
              >
                <source src={videoUrl} />
              </video>
            </DialogContent>
          </Dialog>
        </>
      );
    } else {
      return null;
    }
  }
  return <span className="text-destructive">Unsupported media type</span>;
}
