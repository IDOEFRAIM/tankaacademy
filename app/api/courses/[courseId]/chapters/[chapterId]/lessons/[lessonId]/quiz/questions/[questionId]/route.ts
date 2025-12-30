import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, questionId } = await params;
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

    const question = await db.question.update({
      where: {
        id: questionId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUIZ_QUESTION_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, questionId } = await params;

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

    const question = await db.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUIZ_QUESTION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
