import { NextResponse } from "next/server";
import path from "path";
import { mkdir } from "fs/promises";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

export async function POST(req: Request) {
  try {
    // Get filename from header
    const headerFilename = req.headers.get("X-File-Name");
    
    // Fallback to FormData if header is missing (backward compatibility or small files)
    if (!headerFilename) {
      // ... existing logic for FormData could go here, but let's enforce the new way for consistency
      // or try to parse FormData if content-type is multipart
      const contentType = req.headers.get("Content-Type") || "";
      if (contentType.includes("multipart/form-data")) {
         const data = await req.formData();
         const file: File | null = data.get("file") as unknown as File;
         if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
         
         const bytes = await file.arrayBuffer();
         const buffer = Buffer.from(bytes);
         const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
         const uploadDir = path.join(process.cwd(), "public/uploads");
         try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}
         const filepath = path.join(uploadDir, filename);
         const { writeFile } = await import("fs/promises");
         await writeFile(filepath, buffer);
         return NextResponse.json({ url: `/uploads/${filename}` });
      }
      
      return NextResponse.json({ error: "Missing X-File-Name header" }, { status: 400 });
    }
    
    const originalName = decodeURIComponent(headerFilename);
    const filename = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "")}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");
    
    // Ensure directory exists
    try {
        await mkdir(uploadDir, { recursive: true });
    } catch (e) {
        // Ignore if exists
    }

    const filepath = path.join(uploadDir, filename);

    if (!req.body) {
        return NextResponse.json({ error: "No body" }, { status: 400 });
    }

    // Stream directly to disk to avoid memory issues
    // @ts-ignore
    const nodeStream = Readable.fromWeb(req.body);
    const fileStream = createWriteStream(filepath);

    await pipeline(nodeStream, fileStream);

    const url = `/uploads/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
