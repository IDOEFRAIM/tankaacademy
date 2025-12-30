import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    const quiz = await db.quiz.findUnique({
      where: {
        lessonId: lessonId,
      },
      include: {
        questions: {
          orderBy: {
            position: "asc",
          },
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, lessonId } = await params;
    const { title } = await req.json();

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

    const quiz = await db.quiz.upsert({
      where: {
        lessonId: lessonId,
      },
      update: {
        title,
      },
      create: {
        lessonId: lessonId,
        title,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, lessonId } = await params;

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

    const quiz = await db.quiz.delete({
      where: {
        lessonId: lessonId,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.log("[QUIZ_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
