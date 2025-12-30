"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createComment = async (lessonId: string, content: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Non autorisé" };
    }

    if (!content || content.trim() === "") {
      return { error: "Le commentaire ne peut pas être vide" };
    }

    await db.comment.create({
      data: {
        content,
        lessonId,
        userId,
      },
    });

    revalidatePath(`/courses/[courseId]/lessons/${lessonId}`);
    return { success: true };
  } catch (error) {
    console.log("[CREATE_COMMENT]", error);
    return { error: "Une erreur est survenue" };
  }
};

export const deleteComment = async (commentId: string, path: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Non autorisé" };
    }

    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      return { error: "Commentaire introuvable" };
    }

    if (comment.userId !== userId) {
      return { error: "Non autorisé" };
    }

    await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.log("[DELETE_COMMENT]", error);
    return { error: "Une erreur est survenue" };
  }
};
