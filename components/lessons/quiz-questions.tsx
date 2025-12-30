"use client";

import { useState } from "react";
import axios from "axios";
import { Plus, Pencil, Trash, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Question, Option } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuizQuestionsProps {
  quizId: string;
  questions: (Question & { options: Option[] })[];
  courseId: string;
  chapterId: string;
  lessonId: string;
}

export const QuizQuestions = ({
  quizId,
  questions,
  courseId,
  chapterId,
  lessonId,
}: QuizQuestionsProps) => {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  const onAddQuestion = async () => {
    try {
      setIsSubmitting(true);
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions`,
        { text: newQuestionText }
      );
      toast.success("Question ajoutée");
      setNewQuestionText("");
      setIsAdding(false);
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'ajout de la question");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteQuestion = async (questionId: string) => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions/${questionId}`
      );
      toast.success("Question supprimée");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Questions</h3>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant="ghost"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une question
        </Button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-x-2">
          <Input
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            placeholder="Texte de la question"
          />
          <Button onClick={onAddQuestion} disabled={!newQuestionText || isSubmitting}>
            Ajouter
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {questions.map((question) => (
          <QuizQuestionItem
            key={question.id}
            question={question}
            courseId={courseId}
            chapterId={chapterId}
            lessonId={lessonId}
          />
        ))}
      </div>
    </div>
  );
};

interface QuizQuestionItemProps {
  question: Question & { options: Option[] };
  courseId: string;
  chapterId: string;
  lessonId: string;
}

const QuizQuestionItem = ({
  question,
  courseId,
  chapterId,
  lessonId,
}: QuizQuestionItemProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(question.text);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [newOptionCorrect, setNewOptionCorrect] = useState(false);

  const onUpdate = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions/${question.id}`,
        { text }
      );
      toast.success("Question mise à jour");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions/${question.id}`
      );
      toast.success("Question supprimée");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const onAddOption = async () => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions/${question.id}/options`,
        { text: newOptionText, isCorrect: newOptionCorrect }
      );
      toast.success("Option ajoutée");
      setNewOptionText("");
      setNewOptionCorrect(false);
      setIsAddingOption(false);
      router.refresh();
    } catch {
      toast.error("Erreur lors de l'ajout de l'option");
    }
  };

  const onDeleteOption = async (optionId: string) => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz/questions/${question.id}/options/${optionId}`
      );
      toast.success("Option supprimée");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression de l'option");
    }
  };

  return (
    <div className="border rounded-md p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <div className="flex items-center gap-x-2 w-full mr-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={onUpdate} size="sm">
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">
              X
            </Button>
          </div>
        ) : (
          <span className="font-medium">{question.text}</span>
        )}
        <div className="flex items-center gap-x-2">
          <Button onClick={() => setIsEditing(!isEditing)} variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button onClick={onDelete} variant="destructive" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pl-4 space-y-1">
        {question.options.map((option) => (
          <div key={option.id} className="flex items-center justify-between text-sm bg-slate-50 p-1 rounded">
            <div className="flex items-center gap-x-2">
              <span className={cn(option.isCorrect && "text-green-600 font-medium")}>
                {option.text}
              </span>
              {option.isCorrect && <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px]">Correct</Badge>}
            </div>
            <Button
              onClick={() => onDeleteOption(option.id)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        ))}
        
        {isAddingOption ? (
          <div className="flex items-center gap-x-2 mt-2">
            <Input
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              placeholder="Option"
              className="h-8 text-sm"
            />
            <div className="flex items-center gap-x-1">
                <input 
                    type="checkbox" 
                    checked={newOptionCorrect} 
                    onChange={(e) => setNewOptionCorrect(e.target.checked)}
                    className="h-4 w-4"
                />
                <span className="text-xs">Correct?</span>
            </div>
            <Button onClick={onAddOption} size="sm" className="h-8" disabled={!newOptionText}>
              Ajouter
            </Button>
            <Button onClick={() => setIsAddingOption(false)} variant="ghost" size="sm" className="h-8">
              Annuler
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingOption(true)}
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-6 mt-1"
          >
            <Plus className="h-3 w-3 mr-2" />
            Ajouter une option
          </Button>
        )}
      </div>
    </div>
  );
};
