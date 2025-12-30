import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; optionId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, optionId } = await params;
    const values = await req.json();

    if (!session?.user || session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        instructorId: session.user.id,
      },
    });

    if (!courseOwner && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const option = await db.option.update({
      where: {
        id: optionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[QUIZ_OPTION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; optionId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, optionId } = await params;

    if (!session?.user || session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courseOwner = await db.course.findFirst({
      where: {
        id: courseId,
        instructorId: session.user.id,
      },
    });

    if (!courseOwner && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const option = await db.option.delete({
      where: {
        id: optionId,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[QUIZ_OPTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
