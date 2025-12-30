"use client";

import { Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteCourse, publishCourse, unpublishCourse } from "@/actions/courses";
import { useConfetti } from "@/hooks/use-confetti";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

export const CourseActions = ({
  disabled,
  courseId,
  isPublished
}: CourseActionsProps) => {
  const router = useRouter();
  const confetti = useConfetti();
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
        await unpublishCourse(courseId);
        toast.success("Cours dépublié");
      } else {
        await publishCourse(courseId);
        toast.success("Cours publié");
        confetti.onOpen();
        router.push("/instructor/courses");
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

      await deleteCourse(courseId);

      toast.success("Cours supprimé");
      router.refresh();
      router.push(`/instructor/courses`);
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
