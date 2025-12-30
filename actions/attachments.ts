"use server";

import { revalidatePath } from "next/cache";

import { AuthService } from "@/services";
import { prisma } from "@/lib/prisma";

export const createAttachment = async (courseId: string, url: string) => {
  try {
    const user = await AuthService.requireInstructor();

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!courseOwner) {
      return { error: "Non autorisé" };
    }

    const attachment = await prisma.attachment.create({
      data: {
        url,
        name: url.split("/").pop() || "Fichier",
        courseId: courseId,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: "Pièce jointe ajoutée", attachment };
  } catch (error) {
    console.log("[CREATE_ATTACHMENT]", error);
    return { error: "Erreur lors de l'ajout de la pièce jointe" };
  }
};

export const deleteAttachment = async (attachmentId: string, courseId: string) => {
  try {
    const user = await AuthService.requireInstructor();

    const courseOwner = await prisma.course.findUnique({
      where: {
        id: courseId,
        instructorId: user.id,
      },
    });

    if (!courseOwner) {
      return { error: "Non autorisé" };
    }

    const attachment = await prisma.attachment.delete({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: "Pièce jointe supprimée", attachment };
  } catch (error) {
    console.log("[DELETE_ATTACHMENT]", error);
    return { error: "Erreur lors de la suppression" };
  }
};
