// @ts-nocheck
"use client";

import { Loader2, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { useLessonCompleteModal } from "@/hooks/use-lesson-complete-modal";
import { updateProgress } from "@/actions/progress";
import { Button } from "@/components/ui/button";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoPlayerProps {
  videoUrl: string;
  courseId: string;
  lessonId: string;
  nextLessonId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  className?: string;
}

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

  // Détection simple pour Bunny (iframe)
  const isBunny = videoUrl?.includes("iframe.mediadelivery.net");
  // Conversion explicite pour l'embed si l'URL est au format /play/
  const embedUrl = isBunny ? videoUrl.replace("/play/", "/embed/") : videoUrl;

  const isCloudinary = videoUrl?.includes("cloudinary.com");
  // Normalize YouTube URLs (support youtu.be, shorts, and remove extra params)
  const normalizedUrl = (() => {
    if (!videoUrl) return "";
    let url = videoUrl.trim();
    try {
      const u = new URL(url);
      // youtu.be short links
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "");
        return `https://www.youtube.com/watch?v=${id}`;
      }
      // youtube shorts
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/shorts/")[1];
        return `https://www.youtube.com/watch?v=${id}`;
      }
      // remove "si" param which can break embeds
      if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
        u.searchParams.delete("si");
        return u.toString();
      }
    } catch {}
    return url;
  })();

  useEffect(() => {
    setHasError(false);
    setIsReady(false);
  }, [videoUrl]);

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

  const onRetry = () => {
    setHasError(false);
    setIsReady(false);
  };

  if (isLocked) {
    return (
      <div className={cn("relative aspect-video flex items-center justify-center bg-slate-900 flex-col gap-y-2 text-white", className)}>
        <Lock className="h-8 w-8" />
        <p className="text-sm font-medium">Ce contenu est verrouillé</p>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-video bg-black overflow-hidden rounded-md", className)}>
      {/* 1. ERREUR UI */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white z-30">
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <p className="text-sm">Impossible de charger la vidéo.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="bg-transparent border-slate-600 hover:bg-slate-700"
            >
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* 2. LOADER UI - Affiché tant que ce n'est pas prêt et pas d'erreur */}
      {!isReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-20">
          <div className="flex flex-col items-center gap-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-xs text-slate-400">Chargement du flux...</p>
          </div>
        </div>
      )}

      {/* 3. PLAYER */}
      {isBunny ? (
        <iframe
          src={embedUrl}
          className={cn("w-full h-full", (!isReady || hasError) && "invisible")}
          frameBorder="0"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" 
          allowFullScreen={true}
          onLoad={() => setIsReady(true)}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className={cn("h-full w-full", (!isReady || hasError) && "invisible")}>
          <ReactPlayer
            url={normalizedUrl || videoUrl}
            width="100%"
            height="100%"
            controls
            onReady={() => {
              setIsReady(true);
              setHasError(false);
            }}
            onEnded={onEnd}
            onError={(e) => {
              console.error("ReactPlayer Error:", e);
              // Si Cloudinary échoue avec ReactPlayer, on pourrait basculer sur un tag video standard
              setHasError(true);
              setIsReady(false);
            }}
            config={{
              youtube: { playerVars: { modestbranding: 1, rel: 0 } },
              file: { attributes: { controlsList: "nodownload", playsInline: true } }
            }}
          />
        </div>
      )}
    </div>
  );
};