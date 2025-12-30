"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateAttachmentLessons = async (
  attachmentId: string,
  courseId: string,
  lessonIds: string[]
) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Non autorisé" };
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!courseOwner) {
      return { error: "Non autorisé" };
    }

    // Update the attachment's lessons
    // First disconnect all, then connect new ones
    await db.attachment.update({
      where: {
        id: attachmentId,
      },
      data: {
        lessons: {
          set: [], // Clear existing connections
          connect: lessonIds.map((id) => ({ id })), // Connect new ones
        },
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.log("[UPDATE_ATTACHMENT_LESSONS]", error);
    return { error: "Une erreur est survenue" };
  }
};
