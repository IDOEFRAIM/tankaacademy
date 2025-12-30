import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string; questionId: string }> }
) {
  try {
    const session = await auth();
    const { courseId, questionId } = await params;
    const { text, isCorrect } = await req.json();

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

    const option = await db.option.create({
      data: {
        text,
        isCorrect,
        questionId,
      },
    });

    return NextResponse.json(option);
  } catch (error) {
    console.log("[QUIZ_OPTION_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
