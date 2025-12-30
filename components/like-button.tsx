"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleLike } from "@/actions/toggle-like";

interface LikeButtonProps {
  lessonId: string;
  courseId: string;
  isLiked: boolean;
  likeCount: number;
}

export const LikeButton = ({
  lessonId,
  courseId,
  isLiked: initialIsLiked,
  likeCount: initialLikeCount,
}: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      
      // Optimistic update
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

      const result = await toggleLike(lessonId, courseId);

      if (result.error) {
        // Revert on error
        setIsLiked(!newIsLiked);
        setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        toast.error("Une erreur est survenue");
      } else {
        toast.success(newIsLiked ? "Vous aimez cette leçon" : "Vous n'aimez plus cette leçon");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="ghost"
      size="sm"
      className={cn(
        "text-slate-600 hover:text-sky-700 transition",
        isLiked && "text-sky-700 font-medium"
      )}
    >
      <ThumbsUp className={cn("h-4 w-4 mr-2", isLiked && "fill-sky-700")} />
      {likeCount > 0 ? likeCount : "J'aime"}
    </Button>
  );
};
