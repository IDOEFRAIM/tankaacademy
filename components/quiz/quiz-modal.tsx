"use client";

import { useState, useEffect } from "react";
import { Question, Option, Quiz } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  XCircle, 
  Trophy, 
  ArrowRight, 
  RotateCcw, 
  Star,
  PartyPopper,
  Flame
} from "lucide-react";
import confetti from "canvas-confetti";

interface QuizModalProps {
  quiz: Quiz & { questions: (Question & { options: Option[] })[] };
}

export const QuizModal = ({ quiz }: QuizModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  const handleStart = () => {
    setGameStarted(true);
    setScore(0);
    setStreak(0);
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setSelectedOptions([]);
    setIsChecked(false);
    setAnswers({});
  };

  const handleOptionToggle = (optionId: string) => {
    if (isChecked) return;
    
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleValidate = () => {
    if (selectedOptions.length === 0) return;
    
    setIsChecked(true);

    // Logic: Check if ALL selected options are correct AND ALL correct options are selected
    // But user said "even if there is only one correct answer", implying we just check if the selection matches the correct set.
    
    const correctOptionIds = currentQuestion.options.filter(opt => opt.isCorrect).map(opt => opt.id);
    
    // Check if selected options match exactly the correct options
    const isCorrect = 
      selectedOptions.length === correctOptionIds.length &&
      selectedOptions.every(id => correctOptionIds.includes(id));

    setAnswers(prev => ({ ...prev, [currentQuestion.id]: isCorrect }));
    
    if (isCorrect) {
      setScore(prev => prev + 10 + (streak * 2)); // Bonus points for streak
      setStreak(prev => prev + 1);
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#22c55e', '#4ade80'] // Green confetti
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptions([]);
      setIsChecked(false);
    } else {
      setShowResult(true);
      if (score > (totalQuestions * 5)) { // Simple threshold for celebration
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const getStars = () => {
    const maxScore = totalQuestions * 10 + (totalQuestions * (totalQuestions - 1)); // Rough max score estimate
    // Simplified percentage based on base points (10 per question)
    const percentage = (score / (totalQuestions * 10)) * 100; 
    
    if (percentage >= 100) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 40) return 1;
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg transform transition hover:scale-[1.02]"
        >
          <Trophy className="h-5 w-5 mr-2 animate-bounce" />
          <span className="font-bold text-lg">Lancer le Défi Quiz !</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-slate-50 border-2 border-indigo-100">
        {!gameStarted ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="h-12 w-12 text-indigo-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-indigo-900">
                Prêt à relever le défi ?
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-slate-600">
              <p className="text-lg">Ce quiz contient <span className="font-bold text-indigo-600">{totalQuestions} questions</span>.</p>
              <p>Gagnez des points et maintenez votre série de victoires !</p>
            </div>
            <Button 
              onClick={handleStart}
              className="w-full text-lg py-6 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xl transition-all hover:translate-y-[-2px]"
            >
              C'est parti ! 🚀
            </Button>
          </div>
        ) : showResult ? (
          <div className="p-8 text-center space-y-6 bg-white">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map((star) => (
                <Star 
                  key={star}
                  className={cn(
                    "h-12 w-12 transition-all duration-500",
                    star <= getStars() 
                      ? "text-yellow-400 fill-yellow-400 scale-110" 
                      : "text-slate-200"
                  )} 
                />
              ))}
            </div>
            
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold text-slate-900">
                {getStars() === 3 ? "Incroyable ! 🏆" : getStars() >= 1 ? "Bien joué ! 👏" : "Continuez vos efforts ! 💪"}
              </DialogTitle>
            </DialogHeader>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Score Final</p>
                  <p className="text-4xl font-black text-indigo-600">{score}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Questions</p>
                  <p className="text-4xl font-black text-slate-700">
                    {quiz.questions.filter((q) => answers[q.id]).length}/{totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setIsOpen(false)} 
                variant="outline" 
                className="flex-1 py-6 text-lg border-2"
              >
                Fermer
              </Button>
              <Button 
                onClick={handleStart} 
                className="flex-1 py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Rejouer
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header Bar */}
            <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 p-1.5 rounded-lg">
                  <Flame className={cn("h-5 w-5 transition-all", streak > 2 ? "text-orange-500 animate-pulse" : "text-orange-300")} />
                </div>
                <span className="font-bold text-orange-600">x{streak}</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>
              <div className="font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg">
                {score} pts
              </div>
            </div>

            {/* Question Area */}
            <div className="p-6 flex-1 bg-slate-50 overflow-y-auto">
              <div className="mb-8">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-100 px-2 py-1 rounded">
                  Question {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-3 leading-relaxed">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOptions.includes(option.id);
                  const isCorrect = option.isCorrect;
                  
                  // Show results only after validation (isChecked = true)
                  const showCorrect = isChecked && isCorrect;
                  const showWrong = isChecked && isSelected && !isCorrect;
                  const showMissed = isChecked && !isSelected && isCorrect;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionToggle(option.id)}
                      disabled={isChecked}
                      className={cn(
                        "relative p-4 text-left rounded-xl border-2 transition-all duration-200 group",
                        // Default state (not checked yet)
                        !isChecked && !isSelected && "hover:border-indigo-300 hover:bg-white hover:shadow-md bg-white border-slate-200",
                        !isChecked && isSelected && "border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500",
                        
                        // Checked state
                        isChecked && !showCorrect && !showWrong && !showMissed && "opacity-50 grayscale bg-slate-100 border-slate-200",
                        showCorrect && "border-green-500 bg-green-50 shadow-green-100 shadow-lg scale-[1.02] z-10",
                        showWrong && "border-red-500 bg-red-50",
                        showMissed && "border-green-500 bg-white border-dashed opacity-70"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                            isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300",
                            isChecked && isCorrect && "bg-green-500 border-green-500",
                            isChecked && showWrong && "bg-red-500 border-red-500"
                          )}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                          <span className={cn(
                            "font-medium text-lg",
                            showCorrect ? "text-green-700" : showWrong ? "text-red-700" : "text-slate-700"
                          )}>
                            {option.text}
                          </span>
                        </div>
                        {showCorrect && <CheckCircle className="h-6 w-6 text-green-500 animate-in zoom-in duration-300" />}
                        {showWrong && <XCircle className="h-6 w-6 text-red-500 animate-in zoom-in duration-300" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t">
              {!isChecked ? (
                <Button
                  onClick={handleValidate}
                  disabled={selectedOptions.length === 0}
                  className={cn(
                    "w-full py-6 text-lg transition-all duration-300",
                    selectedOptions.length > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-lg translate-y-0 opacity-100" 
                      : "bg-slate-200 text-slate-400 shadow-none translate-y-0 opacity-50"
                  )}
                >
                  Valider ma réponse
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg animate-in fade-in slide-in-from-bottom-4"
                >
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <span className="flex items-center">
                      Voir les résultats <PartyPopper className="ml-2 h-5 w-5" />
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Question suivante <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
