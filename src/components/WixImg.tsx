/* eslint-disable @next/next/no-img-element */
import { ImgHTMLAttributes } from "react";
import { media as wixMedia } from "@wix/sdk";

type WixImgProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height" | "alt"
> & {
  mediaIdentifier: string | undefined;
  placeholder?: string;
  alt?: string | null | undefined;
} & (
    | {
        scaletofill?: true;
        width: number;
        height: number;
      }
    | { scaletofill: false }
  );

export default function WixImg({
  mediaIdentifier,
  placeholder = "/placeholder.png",
  alt,
  ...props
}: WixImgProps) {
  const imgUrl = mediaIdentifier
    ? props.scaletofill || props.scaletofill === undefined
      ? wixMedia.getScaledToFillImageUrl(
          mediaIdentifier,
          props.width,
          props.height,
          {},
        )
      : wixMedia.getImageUrl(mediaIdentifier).url
    : placeholder;

  return <img src={imgUrl} alt={alt || ""} {...props} />;
}
