import { getWixManageMediaClient } from "@/lib/wix-client.server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const fileName = req.nextUrl.searchParams.get("fileName");
  const mimeType = req.nextUrl.searchParams.get("mimeType");
  if (!fileName || !mimeType) {
    return NextResponse.json(
      { error: "Missing required query parameters" },
      { status: 400 },
    );
  }

  const { uploadUrl } =
    await getWixManageMediaClient().files.generateFileUploadUrl(mimeType, {
      fileName,
      filePath: "product-reviews",
      private: false,
    });
  return NextResponse.json({ success: true, uploadUrl });
}

export async function DELETE(req: NextRequest) {
  const { ids } = await req.json();
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: "Invalid request. 'urls' must be a non-empty array." },
      { status: 400 },
    );
  }
  try {
    await getWixManageMediaClient().files.bulkDeleteFiles(ids, {
      permanent: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete files:", error);
    return NextResponse.json(
      { error: "Failed to delete files." },
      { status: 500 },
    );
  }
}
