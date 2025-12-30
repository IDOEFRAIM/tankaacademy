import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string; lessonId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, lessonId } = await params;
    const { text } = await req.json();

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

    const quiz = await db.quiz.findUnique({
      where: {
        lessonId: lessonId,
      },
    });

    if (!quiz) {
      return new NextResponse("Quiz not found", { status: 404 });
    }

    const lastQuestion = await db.question.findFirst({
      where: {
        quizId: quiz.id,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    const question = await db.question.create({
      data: {
        text,
        quizId: quiz.id,
        position: newPosition,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log("[QUIZ_QUESTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
