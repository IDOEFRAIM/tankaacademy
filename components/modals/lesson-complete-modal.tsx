"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLessonCompleteModal } from "@/hooks/use-lesson-complete-modal";
import { ArrowRight, Trophy, Star, Zap } from "lucide-react";
import confetti from "canvas-confetti";

export const LessonCompleteModal = () => {
  const { isOpen, onClose, nextLessonUrl, isCourseComplete } = useLessonCompleteModal();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti burst
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults, 
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const handleContinue = () => {
    onClose();
    if (nextLessonUrl) {
      router.push(nextLessonUrl);
    } else {
      router.refresh();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white border-2 border-indigo-100">
        <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,white,transparent)] animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white p-4 rounded-full shadow-xl mb-4 animate-bounce">
              <Trophy className="h-12 w-12 text-yellow-500 fill-yellow-500" />
            </div>
            <DialogTitle className="text-3xl font-black text-white mb-2 tracking-tight">
              Félicitations ! 🎉
            </DialogTitle>
            <p className="text-indigo-100 font-medium text-lg">
              {isCourseComplete ? "Vous avez terminé ce cours !" : "Leçon terminée avec succès !"}
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center transform transition hover:scale-105">
              <div className="flex justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-sm text-slate-500 font-bold uppercase">XP Gagnés</p>
              <p className="text-2xl font-black text-slate-800">+50</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center transform transition hover:scale-105">
              <div className="flex justify-center mb-2">
                <Star className="h-6 w-6 text-orange-500 fill-orange-500" />
              </div>
              <p className="text-sm text-slate-500 font-bold uppercase">Progression</p>
              <p className="text-2xl font-black text-slate-800">Up!</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {nextLessonUrl ? "Leçon Suivante" : "Terminer le cours"} 
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost" 
              className="w-full text-slate-500 hover:text-slate-700"
            >
              Rester sur cette page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
