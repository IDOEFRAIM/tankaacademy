import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, password, newPassword } = values;

    // Update name
    if (name) {
      await db.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // Update password if provided
    if (password && newPassword) {
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password) {
        return new NextResponse("User not found", { status: 404 });
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return new NextResponse("Incorrect password", { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
