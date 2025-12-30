"use client";

import { useState } from "react";
import { Lesson } from "@/types";
import { CourseService } from "@/services";
import { useRouter } from "next/navigation";

/**
 * Hook pour gérer la logique CRUD des leçons côté client.
 * Ce hook fait le pont entre ton interface (UI) et ton CourseService.
 */
export const useLesson = (courseId: string, chapterId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  /**
   * 1. Création d'une leçon
   */
  const createLesson = async (title: string) => {
    try {
      setIsUpdating(true);
      await CourseService.addLesson(chapterId, title);
      
      // Indispensable avec Next.js App Router pour mettre à jour les données affichées
      router.refresh(); 
      return { success: true };
    } catch (error) {
      console.error("[USE_LESSON_CREATE]", error);
      return { success: false, error: "Erreur lors de la création." };
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 2. Mise à jour d'une leçon (Titre, vidéo, description, etc.)
   */
  const updateLesson = async (lessonId: string, values: Partial<Lesson>) => {
    try {
      setIsUpdating(true);

      // On nettoie les données : Prisma n'aime pas recevoir des objets de 
      // relation (attachments, userProgress) directement dans un update scalaire.
      const { 
        attachments, 
        chapter, 
        userProgress, 
        ...pureData 
      } = values as any;

      // Note : Assure-toi que CourseService possède bien la méthode updateLesson
      await CourseService.updateLesson(lessonId, pureData);
      
      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("[USE_LESSON_UPDATE]", error);
      return { success: false, error: "Erreur lors de la mise à jour." };
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 3. Suppression d'une leçon
   */
  const deleteLesson = async (lessonId: string) => {
    try {
      setIsUpdating(true);
      
      // Note : Assure-toi que CourseService possède bien la méthode deleteLesson
      await CourseService.deleteLesson(lessonId);
      
      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("[USE_LESSON_DELETE]", error);
      return { success: false, error: "Erreur lors de la suppression." };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};