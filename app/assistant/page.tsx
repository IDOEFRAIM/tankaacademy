"use client";

import { AcademicTutor } from "@/components/courses/tutor";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

import useRouter from "next/navigation"; // Ou ton système de navigation habituel

export default function AssistantPage() {
  // Optionnel : si tu veux ajouter un bouton de retour à la page précédente
  // const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-slate-950/20">
      {/* Barre supérieure / Breadcrumb */}
      <div className="border-b bg-background px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-x-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className="font-medium text-sm text-muted-foreground">E-Learning Espace AI</span>
          </div>
        </div>
        
        <div className="flex items-center gap-x-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Grok-Beta Connecté
          </span>
        </div>
      </div>

      {/* Zone principale de l'assistant */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl h-[750px] flex flex-col justify-center">
          {/* Titre de la section */}
          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Votre Tuteur Personnel Indépendant
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Posez des questions sur vos modules, demandez des corrections de code ou des clarifications de concepts complexes.
            </p>
          </div>

          {/* Appel du composant Chat qu'on a créé */}
          <div className="flex-1 min-h-0 bg-background rounded-xl border shadow-md overflow-hidden">
            <AcademicTutor />
          </div>
        </div>
      </main>
    </div>
  );
}