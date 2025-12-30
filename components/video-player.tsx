"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { useLessonCompleteModal } from "@/hooks/use-lesson-complete-modal";
import { updateProgress } from "@/actions/progress";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  lessonId: string;
  nextLessonId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  className?: string;
};

export const VideoPlayer = ({
  videoUrl,
  courseId,
  lessonId,
  nextLessonId,
  isLocked,
  completeOnEnd,
  title,
  className,
}: VideoPlayerProps) => {
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const confetti = useConfetti();
  const lessonCompleteModal = useLessonCompleteModal();

  // Ensure URL is absolute for local files to avoid issues with ReactPlayer
  const getAbsoluteUrl = (url: string) => {
    if (typeof window !== "undefined" && url.startsWith("/")) {
      return `${window.location.origin}${url}`;
    }
    return url;
  };

  const playerUrl = videoUrl;
  const isNativeVideo = playerUrl.endsWith(".mp4") || playerUrl.endsWith(".webm") || playerUrl.endsWith(".ogg");

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await updateProgress(lessonId, true);
        
        lessonCompleteModal.onOpen(
          nextLessonId ? `/courses/${courseId}/lessons/${nextLessonId}` : null,
          !nextLessonId
        );
        
        toast.success("Progression mise à jour");
        router.refresh();
      } else if (nextLessonId) {
        router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  }

  if (hasError) {
    return (
      <div className={cn("relative flex items-center justify-center bg-slate-800 text-white", className)}>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm">Impossible de charger la vidéo</p>
          <Button variant="ghost" size="sm" onClick={() => setHasError(false)} className="text-xs text-slate-300 hover:text-white">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 flex-col gap-y-2 text-white z-10">
          <Lock className="h-8 w-8" />
          <p className="text-sm">
            Ce chapitre est verrouillé
          </p>
        </div>
      )}
      {!isLocked && (
        <div className={cn(
          "absolute inset-0 h-full w-full"
        )}>
          {isNativeVideo ? (
            <video
              src={playerUrl}
              controls
              className="h-full w-full object-contain bg-black"
              onEnded={onEnd}
              onError={(e) => {
                console.error("Native Video Error:", e);
                setHasError(true);
              }}
            />
          ) : (
            <ReactPlayer
              url={getAbsoluteUrl(playerUrl)}
              controls
              width="100%"
              height="100%"
              onReady={() => setIsReady(true)}
              onEnded={onEnd}
              onError={(e) => {
                console.error("Video Error:", e);
                setHasError(true);
              }}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                },
                file: {
                  attributes: {
                    onContextMenu: (e: any) => e.preventDefault(),
                    controlsList: "nodownload"
                  }
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
