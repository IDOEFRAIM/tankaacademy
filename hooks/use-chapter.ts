
import { useState } from "react";
import { Chapter } from "@/types";
import { ChaptersService } from "@/services";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

/**
 * Hook pour gérer la logique des chapitres au sein d'un cours.
 * Idéal pour le Dashboard Formateur.
 */
export const useChapter = (courseId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  /**
   * 1. Ajouter un nouveau chapitre
   */
  const addChapter = async (title: string) => {
    try {
      setIsUpdating(true);
      await ChaptersService.createChapter(courseId, title);
      toast.success("Chapitre créé avec succès");
      router.refresh();
      return { success: true };
    } catch (error) {
      toast.error("Erreur lors de la création");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 2. Réorganiser les chapitres (Drag & Drop)
   * Attend un tableau de type: [{ id: "abc", position: 1 }, ...]
   */
  const reorderChapters = async (updatePayload: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await ChaptersService.reorderChapters(courseId, updatePayload);
      toast.success("Ordre des chapitres mis à jour");
      router.refresh();
      return { success: true };
    } catch (error) {
      toast.error("Erreur lors de la réorganisation");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * 3. Mettre à jour les détails d'un chapitre (Titre, description, publication)
   */
  const updateChapter = async (chapterId: string, values: Partial<Chapter>) => {
    try {
      setIsUpdating(true);
      // Appel au service (à implémenter dans CourseService)
      await ChaptersService.updateChapter(chapterId, courseId, values as any);
      toast.success("Chapitre mis à jour");
      router.refresh();
      return { success: true };
    } catch (error) {
      toast.error("Erreur lors de la modification");
      return { success: false };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    addChapter,
    reorderChapters,
    updateChapter
  };
};