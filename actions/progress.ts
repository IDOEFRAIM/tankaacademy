"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateProgress = async (lessonId: string, isCompleted: boolean) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const userProgress = await db.userProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      }
    },
    update: {
      isCompleted,
    },
    create: {
      userId,
      lessonId,
      isCompleted,
    }
  });

  revalidatePath("/courses");
  
  return userProgress;
}
