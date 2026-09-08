import { NextRequest } from "next/server";
import { requireUser, badRequest, json, serverError } from "@/lib/api";
import { isCloudinaryConfigured, uploadBuffer } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth instanceof NextResponse) return auth;

  if (!isCloudinaryConfigured()) {
    return badRequest(
      "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env",
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string) || "ceyora";

    if (!(file instanceof File)) {
      return badRequest("No file provided");
    }
    if (file.size > MAX_BYTES) {
      return badRequest("File too large (max 8MB)");
    }
    if (!file.type.startsWith("image/")) {
      return badRequest("Only image files are allowed");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadBuffer(buffer, folder);
    return json(result);
  } catch (err) {
    console.error("upload error", err);
    return serverError("Upload failed");
  }
}
