// @ts-nocheck
"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { useLessonCompleteModal } from "@/hooks/use-lesson-complete-modal";
import { updateProgress } from "@/actions/progress";
import { Button } from "@/components/ui/button";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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
  const lessonCompleteModal = useLessonCompleteModal();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await updateProgress(lessonId, true);
        lessonCompleteModal.onOpen(
          nextLessonId ? `/courses/${courseId}/lessons/${nextLessonId}` : null,
          !nextLessonId
        );
        toast.success("Leçon terminée !");
        router.refresh();
      } else if (nextLessonId) {
        router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
      }
    } catch {
      toast.error("Erreur de progression");
    }
  };

  // Fonction de retry logique
  const onRetry = () => {
    setHasError(false);
    setIsReady(false); // On remet le loader pour indiquer qu'on réessaie
  };

  if (isLocked) {
    return (
      <div className={cn("relative aspect-video flex items-center justify-center bg-slate-900 flex-col gap-y-2 text-white", className)}>
        <Lock className="h-8 w-8" />
        <p className="text-sm font-medium">Ce contenu est verrouillé</p>
      </div>
    );
  }
console.log('videoUrl dans VideoPlayer:', videoUrl);
  return (
    <div className={cn("relative aspect-video bg-black overflow-hidden rounded-md", className)}>
      {/* 1. PRIORITÉ : L'ERREUR */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white z-30">
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <p className="text-sm">La vidéo n'est pas encore prête (en cours de transcodage chez Bunny).</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="bg-transparent border-slate-600 hover:bg-slate-700"
            >
              Réessayer la lecture
            </Button>
          </div>
        </div>
      ) : (
        /* 2. LOADER : Uniquement si pas d'erreur et pas prêt */
        !isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-20">
            <div className="flex flex-col items-center gap-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              <p className="text-xs text-slate-400">Chargement du flux...</p>
            </div>
          </div>
        )
      )}

      <div className={cn("h-full w-full", (!isReady || hasError) && "invisible")}>
        <ReactPlayer
          url={videoUrl}
          width="100%"
          height="100%"
          controls
          onReady={() => {
            setIsReady(true);
            setHasError(false);
          }}
          onEnded={onEnd}
          onError={() => {
            setHasError(true);
            setIsReady(false); // Empêche de rester bloqué sur "prêt" si le flux coupe
          }}
          config={{
            youtube: { playerVars: { modestbranding: 1, rel: 0 } },
            file: { attributes: { controlsList: "nodownload", playsInline: true } }
          }}
        />
      </div>
    </div>
  );
};