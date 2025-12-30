"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useConfetti } from "@/hooks/use-confetti";
import { useLessonCompleteModal } from "@/hooks/use-lesson-complete-modal";
import { updateProgress } from "@/actions/progress";

interface CourseProgressButtonProps {
  lessonId: string;
  courseId: string;
  nextLessonId?: string;
  isCompleted?: boolean;
};

export const CourseProgressButton = ({
  lessonId,
  courseId,
  nextLessonId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfetti();
  const lessonCompleteModal = useLessonCompleteModal();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await updateProgress(lessonId, !isCompleted);

      if (!isCompleted) {
        lessonCompleteModal.onOpen(
          nextLessonId ? `/courses/${courseId}/lessons/${nextLessonId}` : null,
          !nextLessonId
        );
      }

      toast.success("Progression mise à jour");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      type="button"
      variant={isCompleted ? "outline" : "default"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Non terminé" : "Marquer comme terminé"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  )
}
