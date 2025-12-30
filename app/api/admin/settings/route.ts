import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/types";
import { SystemSettingsService } from "@/services/system-settings";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user || user.role !== UserRole.ADMIN) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { uploadLimit } = await req.json();

    if (uploadLimit) {
      await SystemSettingsService.set("UPLOAD_LIMIT_BYTES", uploadLimit, "Max upload size in bytes");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[ADMIN_SETTINGS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
