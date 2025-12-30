"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCourse } from "@/actions/courses";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: {
    image: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: "L'image est requise",
  }),
});

export const ImageForm = ({
  initialData,
  courseId
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setUseUrl(false); // Reset mode when toggling
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: initialData.image || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await updateCourse(courseId, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Image mise à jour");
        toggleEdit();
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Image du cours
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Annuler</>
          )}
          {!isEditing && !initialData.image && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une image
            </>
          )}
          {!isEditing && initialData.image && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.image ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.image}
            />
          </div>
        )
      )}
      {isEditing && (
        <div className="mt-4">
          {!useUrl ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="courseImage"
                          accept="image/*"
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
                <div className="text-xs text-muted-foreground">
                  16:9 aspect ratio recommandé
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={() => setUseUrl(true)} 
                  className="w-full text-xs text-muted-foreground"
                >
                  Ou utiliser une URL externe
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="URL de l'image (ex: https://...)"
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
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setUseUrl(false)}
                  >
                    Utiliser l'upload
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  )
}
