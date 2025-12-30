"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PlusCircle, File, Loader2, X, Link } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Attachment, Course, Lesson, Chapter } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { createAttachment, deleteAttachment } from "@/actions/attachments";
import { updateAttachmentLessons } from "@/actions/update-attachment-lessons";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface AttachmentFormProps {
  initialData: Course & { 
    attachments: (Attachment & { lessons: Lesson[] })[];
    chapters: (Chapter & { lessons: Lesson[] })[];
  };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [managingId, setManagingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createAttachment(courseId, values.url);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Pièce jointe ajoutée");
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  }

  const onUpdateLessons = async (attachmentId: string, lessonIds: string[]) => {
    try {
      const response = await updateAttachmentLessons(attachmentId, courseId, lessonIds);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Liaisons mises à jour");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  const allLessons = initialData.chapters.flatMap((chapter) => chapter.lessons).map((lesson) => ({
    label: lesson.title,
    value: lesson.id,
  }));

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await deleteAttachment(id, courseId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Pièce jointe supprimée");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Ressources & Pièces jointes
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Annuler</>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter un fichier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              Aucune pièce jointe
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2 mt-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <div className="ml-auto flex items-center gap-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button 
                            className="hover:opacity-75 transition"
                            title="Gérer les leçons liées"
                          >
                            <Link className="h-4 w-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Lier à des leçons</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-slate-500 mb-4">
                              Sélectionnez les leçons auxquelles ce fichier doit être attaché.
                            </p>
                            <MultiSelect
                              options={allLessons}
                              selected={attachment.lessons.map(l => l.id)}
                              onChange={(selected) => onUpdateLessons(attachment.id, selected)}
                              placeholder="Sélectionner des leçons..."
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                      <button
                        onClick={() => onDelete(attachment.id)}
                        className="hover:opacity-75 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        endpoint="courseAttachment"
                        onChange={(url) => {
                          if (url) {
                            field.onChange(url);
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="text-xs text-muted-foreground mt-4">
            Ajoutez des ressources pour vos étudiants (PDF, Audio, Images, etc.)
          </div>
        </div>
      )}
    </div>
  )
}
