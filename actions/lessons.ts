"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { AuthService, LessonsService } from "@/services";
import { UploadService } from "@/services/upload";
import { CreateLessonSchema, UpdateLessonSchema } from "@/schemas/lessons";

export const createLesson = async (
  chapterId: string,
  courseId: string,
  values: z.infer<typeof CreateLessonSchema>
) => {
  try {
    const user = await AuthService.requireInstructor();
    
    const lesson = await LessonsService.createLesson(chapterId, values.title);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Leçon créée", lesson };
  } catch (error) {
    console.error("[CREATE_LESSON_ACTION]", error);
    return { error: "Impossible de créer la leçon" };
  }
};

export const reorderLessons = async (
  chapterId: string,
  courseId: string,
  updateData: { id: string; position: number }[]
) => {
  try {
    const user = await AuthService.requireInstructor();

    await LessonsService.reorderLessons(chapterId, updateData);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Leçons réorganisées" };
  } catch (error) {
    console.error("[REORDER_LESSONS_ACTION]", error);
    return { error: "Impossible de réorganiser les leçons" };
  }
};

export const updateLesson = async (
  chapterId: string,
  courseId: string,
  lessonId: string,
  values: z.infer<typeof UpdateLessonSchema>
) => {
  try {
    const user = await AuthService.requireInstructor();

    // Check for existing video to delete if replaced
    const currentLesson = await LessonsService.getLessonById(lessonId, chapterId);
    if (
      values.videoUrl && 
      currentLesson?.videoUrl && 
      values.videoUrl !== currentLesson.videoUrl
    ) {
      // Use try-catch specifically for file deletion to not block the update
      try {
        await UploadService.deletePhysicalFile(currentLesson.videoUrl);
      } catch (e) {
        console.error("Failed to delete old video file:", e);
      }
    }

    const lesson = await LessonsService.updateLesson(lessonId, chapterId, values);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Leçon mise à jour", lesson };
  } catch (error) {
    console.error("[UPDATE_LESSON_ACTION]", error);
    return { error: "Impossible de mettre à jour la leçon" };
  }
};

export const deleteLesson = async (
  courseId: string,
  chapterId: string,
  lessonId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    // Delete video file if exists
    const lesson = await LessonsService.getLessonById(lessonId, chapterId);
    if (lesson?.videoUrl) {
      await UploadService.deletePhysicalFile(lesson.videoUrl);
    }

    await LessonsService.deleteLesson(lessonId, chapterId);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}`);

    return { success: "Leçon supprimée" };
  } catch (error) {
    console.error("[DELETE_LESSON_ACTION]", error);
    return { error: "Impossible de supprimer la leçon" };
  }
};

export const publishLesson = async (
  courseId: string,
  chapterId: string,
  lessonId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    await LessonsService.publishLesson(lessonId, chapterId);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);

    return { success: "Leçon publiée" };
  } catch (error) {
    console.error("[PUBLISH_LESSON_ACTION]", error);
    return { error: "Impossible de publier la leçon" };
  }
};

export const unpublishLesson = async (
  courseId: string,
  chapterId: string,
  lessonId: string
) => {
  try {
    const user = await AuthService.requireInstructor();

    await LessonsService.unpublishLesson(lessonId, chapterId);

    revalidatePath(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);

    return { success: "Leçon dépubliée" };
  } catch (error) {
    console.error("[UNPUBLISH_LESSON_ACTION]", error);
    return { error: "Impossible de dépublier la leçon" };
  }
};
