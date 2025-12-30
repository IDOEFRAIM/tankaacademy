"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { AuthService, ChaptersService } from "@/services";
import { CreateChapterSchema, UpdateChapterSchema } from "@/schemas/chapters";

export const createChapter = async (
  courseId: string, 
  values: z.infer<typeof CreateChapterSchema>
) => {
  try {
    const user = await AuthService.requireInstructor();
    
    // TODO: Vérifier que le cours appartient bien à l'instructeur (déjà fait partiellement dans les services mais bon de le refaire ici pour la sécu)
    
    const chapter = await ChaptersService.createChapter(courseId, values.title);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Chapitre créé", chapter };
  } catch (error) {
    console.error("[CREATE_CHAPTER_ACTION]", error);
    return { error: "Impossible de créer le chapitre" };
  }
};

export const reorderChapters = async (
  courseId: string,
  updateData: { id: string; position: number }[]
) => {
  try {
    const user = await AuthService.requireInstructor();

    await ChaptersService.reorderChapters(courseId, updateData);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Chapitres réorganisés" };
  } catch (error) {
    console.error("[REORDER_CHAPTERS_ACTION]", error);
    return { error: "Impossible de réorganiser les chapitres" };
  }
};

export const updateChapter = async (
  courseId: string,
  chapterId: string,
  values: z.infer<typeof UpdateChapterSchema>
) => {
  try {
    const user = await AuthService.requireInstructor();

    const chapter = await ChaptersService.updateChapter(chapterId, courseId, values);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Chapitre mis à jour", chapter };
  } catch (error) {
    console.error("[UPDATE_CHAPTER_ACTION]", error);
    return { error: "Impossible de mettre à jour le chapitre" };
  }
};

export const deleteChapter = async (
  courseId: string,
  chapterId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    await ChaptersService.deleteChapter(chapterId, courseId);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Chapitre supprimé" };
  } catch (error) {
    console.error("[DELETE_CHAPTER_ACTION]", error);
    return { error: "Impossible de supprimer le chapitre" };
  }
};

export const publishChapter = async (
  courseId: string,
  chapterId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    await ChaptersService.publishChapter(chapterId, courseId);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Chapitre publié" };
  } catch (error) {
    console.error("[PUBLISH_CHAPTER_ACTION]", error);
    return { error: "Impossible de publier le chapitre" };
  }
};

export const unpublishChapter = async (
  courseId: string,
  chapterId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    await ChaptersService.unpublishChapter(chapterId, courseId);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Chapitre dépublié" };
  } catch (error) {
    console.error("[UNPUBLISH_CHAPTER_ACTION]", error);
    return { error: "Impossible de dépublier le chapitre" };
  }
};
