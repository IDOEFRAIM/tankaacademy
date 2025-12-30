"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const toggleLike = async (lessonId: string, courseId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized" };
    }

    const existingLike = await db.lessonLike.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (existingLike) {
      await db.lessonLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await db.lessonLike.create({
        data: {
          userId,
          lessonId,
        },
      });
    }

    revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
    return { success: true };
  } catch (error) {
    console.log("[TOGGLE_LIKE]", error);
    return { error: "Internal Error" };
  }
};
