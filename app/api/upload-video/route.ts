import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createWriteStream, promises as fs } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";
import { tmpdir } from "os";
import { join } from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const filename = request.headers.get("X-File-Name");

    if (!filename || !request.body) {
      return NextResponse.json({ error: "File not provided" }, { status: 400 });
    }

    const tempFilePath = join(
      tmpdir(),
      `upload-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`
    );

    // Stream directly to disk
    // @ts-ignore
    const nodeStream = Readable.fromWeb(request.body);
    await pipeline(nodeStream, createWriteStream(tempFilePath));

    // Upload to Cloudinary via API (supports large files)
    const result = await cloudinary.uploader.upload_large(tempFilePath, {
      resource_type: "video",
      folder: "tankaacademy",
      chunk_size: 6000000, // 6MB chunks 
      overwrite: true,
      use_filename: true,
      filename_override: filename,
    }) as any;

    // Cleanup
    await fs.unlink(tempFilePath).catch(() => {});

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
