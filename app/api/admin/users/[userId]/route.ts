import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = await params;
    const values = await req.json();

    // Prevent changing own role to avoid locking oneself out
    if (userId === currentUser.id && values.role && values.role !== "ADMIN") {
        return new NextResponse("Cannot demote yourself", { status: 400 });
    }

    // Filtrer les champs autorisés pour éviter les erreurs Prisma (Unknown argument)
    const { role, isSuspended, suspendedReason, suspendedAt, suspendedUntil } = values;

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        ...(role !== undefined && { role }),
        ...(isSuspended !== undefined && { isSuspended }),
        ...(suspendedReason !== undefined && { suspendedReason }),
        ...(suspendedAt !== undefined && { suspendedAt }),
        ...(suspendedUntil !== undefined && { suspendedUntil }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    const currentUser = session?.user;

    if (!currentUser || currentUser.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { userId } = await params;

    if (userId === currentUser.id) {
      return new NextResponse("Cannot delete yourself", { status: 400 });
    }

    const user = await db.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
