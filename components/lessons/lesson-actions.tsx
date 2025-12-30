"use client";

import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteLesson, publishLesson, unpublishLesson } from "@/actions/lessons";

interface LessonActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  lessonId: string;
  isPublished: boolean;
};

export const LessonActions = ({
  disabled,
  courseId,
  chapterId,
  lessonId,
  isPublished
}: LessonActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await unpublishLesson(courseId, chapterId, lessonId);
        toast.success("Leçon dépubliée");
      } else {
        await publishLesson(courseId, chapterId, lessonId);
        toast.success("Leçon publiée");
      }

      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await deleteLesson(courseId, chapterId, lessonId);

      toast.success("Leçon supprimée");
      router.refresh();
      router.push(`/instructor/courses/${courseId}/chapters/${chapterId}`);
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Dépublier" : "Publier"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
