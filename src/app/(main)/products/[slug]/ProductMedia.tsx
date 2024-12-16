import WixImg from "@/components/WixImg";
import { cn } from "@/lib/utils";
import { products } from "@wix/stores";
import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";

interface ProductMediaProps {
  media: products.MediaItem[] | undefined;
}

export default function ProductMedia({ media }: ProductMediaProps) {
  const [selectedMedia, setSelectedMedia] = useState(media?.[0]);

  useEffect(() => {
    setSelectedMedia(media?.[0]);
  }, [media]);

  if (!media?.length) return null;

  const selectedImg = selectedMedia?.image;
  const selectedVideo = selectedMedia?.video?.files?.[0];

  return (
    <div className="h-fit basis-1/2 space-y-5 md:sticky md:top-10">
      <div className="aspect-square rounded-2xl bg-secondary">
        {selectedImg?.url ? (
          <Zoom key={selectedImg.url}>
            <WixImg
              mediaIdentifier={selectedImg.url}
              alt={selectedImg.altText}
              width={1000}
              height={1000}
              className="rounded-2xl"
            />
          </Zoom>
        ) : selectedVideo?.url ? (
          <div className="flex size-full items-center bg-black">
            <video controls className="size-full">
              <source
                src={selectedVideo.url}
                type={`video/${selectedVideo.format}`}
              />
            </video>
          </div>
        ) : null}
      </div>
      {media.length > 1 && (
        <div className="flex w-full justify-center gap-5">
          {media.map((item) => (
            <MediaPreview
              key={item._id}
              mediaItem={item}
              isSelected={item._id === selectedMedia?._id}
              onSelect={() => setSelectedMedia(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface MediaPreviewProps {
  mediaItem: products.MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function MediaPreview({ mediaItem, isSelected, onSelect }: MediaPreviewProps) {
  const imgUrl = mediaItem.image?.url;
  const stillFrame = mediaItem.video?.stillFrameMediaId;
  const thumbnail = mediaItem.thumbnail?.url;
  const trueThumbnail =
    stillFrame && thumbnail
      ? thumbnail.split(stillFrame)[0] + stillFrame
      : undefined;

  return !imgUrl && !trueThumbnail ? null : (
    <div
      className={cn(
        "relative cursor-pointer rounded-xl bg-secondary",
        isSelected && "outline outline-2 outline-primary",
      )}
    >
      <WixImg
        mediaIdentifier={imgUrl || trueThumbnail}
        alt={mediaItem.image?.altText || mediaItem.video?.files?.[0].altText}
        width={120}
        height={120}
        onMouseEnter={onSelect}
        className="rounded-xl"
      />
      {trueThumbnail && (
        <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 outline outline-2 outline-white">
          <PlayIcon className="size-9 text-white" />
        </span>
      )}
    </div>
  );
}
