"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Quiz, Question, Option } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { QuizQuestions } from "./quiz-questions";

interface LessonQuizFormProps {
  initialData: {
    quiz: (Quiz & { questions: (Question & { options: Option[] })[] }) | null;
  };
  courseId: string;
  chapterId: string;
  lessonId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
});

export const LessonQuizForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId,
}: LessonQuizFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);
  const toggleCreate = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.quiz?.title || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz`,
        values
      );
      toast.success("Quiz mis à jour");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const onCreate = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz`,
        values
      );
      toast.success("Quiz créé");
      toggleCreate();
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/quiz`
      );
      toast.success("Quiz supprimé");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Quiz de la leçon
        <div className="flex items-center gap-x-2">
          {initialData.quiz && (
            <Button onClick={onDelete} variant="destructive" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          )}
          {initialData.quiz ? (
            <Button onClick={toggleEdit} variant="ghost">
              {isEditing ? (
                <>Annuler</>
              ) : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier titre
                </>
              )}
            </Button>
          ) : (
            <Button onClick={toggleCreate} variant="ghost">
              {isCreating ? (
                <>Annuler</>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter un quiz
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {!initialData.quiz && !isCreating && (
        <p className="text-sm mt-2 text-slate-500 italic">
          Aucun quiz pour cette leçon
        </p>
      )}

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onCreate)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Titre du quiz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Créer
              </Button>
            </div>
          </form>
        </Form>
      )}

      {initialData.quiz && !isEditing && (
        <p className="text-sm mt-2 font-semibold">
          {initialData.quiz.title}
        </p>
      )}

      {initialData.quiz && isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Titre du quiz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting}
                type="submit"
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}

      {initialData.quiz && (
        <QuizQuestions
          quizId={initialData.quiz.id}
          questions={initialData.quiz.questions}
          courseId={courseId}
          chapterId={chapterId}
          lessonId={lessonId}
        />
      )}
    </div>
  );
};
