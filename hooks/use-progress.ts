import { useState } from "react";
import { ProgressService } from "@/services";
import { useRouter } from "next/navigation";
import { useConfetti } from "./use-confetti";
import { useAuth } from "./use-auth"; // Import indispensable pour l'ID
import { toast } from "react-hot-toast";

/**
 * Hook pour gérer la progression d'un élève sur un cours
 */
export const useProgress = (courseId: string) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { userId } = useAuth(); // On récupère le userId via ton hook d'auth
  const router = useRouter();
  const confetti = useConfetti();

  /**
   * Marquer une leçon comme terminée ou non
   */
  const toggleProgress = async (lessonId: string, currentStatus: boolean) => {
    // Sécurité : Si pas d'utilisateur, on ne fait rien
    if (!userId) {
      toast.error("Vous devez être connecté");
      return { success: false };
    }

    try {
      setIsUpdating(true);
      const newStatus = !currentStatus;
      
      // CORRECTION : On passe userId comme 1er argument selon la signature du service
      await ProgressService.updateProgress(userId, lessonId, newStatus);
      
      // CORRECTION : On passe userId et courseId
      const progress = await ProgressService.getCourseProgress(userId, courseId);
      
      if (progress === 100 && newStatus) {
        confetti.onOpen();
        toast.success("Félicitations ! Cours terminé !");
      }

      router.refresh();
      return { success: true, progress };
    } catch (error) {
      toast.error("Erreur de synchronisation");
      return { success: false, error: "Impossible de mettre à jour" };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    toggleProgress,
  };
};