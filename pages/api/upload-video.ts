import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const filename = (req.headers["x-filename"] as string) || "upload.mp4";

    // Since we receive a raw Octet-Stream, we need to save it to a temp file manually
    // or stream it directly.
    // However, piping req directly to cloudinary upload_large is tricky because upload_large expects a file path.
    // We can use upload_stream, but upload_large is more robust for huge files.
    // Given the ENOENT issue and robustness, let's write to a temp file first using Node streams.
    
    // We'll use os.tmpdir and ensure the file exists.
    const fs = await import("fs");
    const path = await import("path");
    const os = await import("os");

    const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "")}`);
    
    const writeStream = fs.createWriteStream(tempFilePath);

    await new Promise((resolve, reject) => {
      req.pipe(writeStream);
      writeStream.on("finish", () => {
         // wait for close ensuring fd is closed
         // But finish is enough for writeStream usually? 'close' is safer.
      });
      writeStream.on("close", resolve);
      writeStream.on("error", reject);
      req.on("error", reject);
    });

    // Verify file exists and has size
    const stats = await fs.promises.stat(tempFilePath);
    if (stats.size === 0) {
       throw new Error("File upload failed: 0 bytes received");
    }

    const result = await cloudinary.uploader.upload_large(tempFilePath, {
      resource_type: "video",
      folder: "tankaacademy",
      chunk_size: 6000000,
      overwrite: true,
      use_filename: true,
      filename_override: filename,
    });

    // Cleanup
    await fs.promises.unlink(tempFilePath).catch(() => {});

    return res.status(200).json({ url: result.secure_url });

  } catch (error: any) {
    console.error("Upload handler error:", error);
    return res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
