"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateLesson } from "@/actions/lessons";
import { FileUpload } from "@/components/file-upload";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { getCourseVideos } from "@/actions/get-course-videos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface LessonVideoFormProps {
  initialData: {
    videoUrl: string | null;
  };
  courseId: string;
  chapterId: string;
  lessonId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, { message: "L'URL de la vidéo est requise" }),
});

export const LessonVideoForm = ({
  initialData,
  courseId,
  chapterId,
  lessonId
}: LessonVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const [existingVideos, setExistingVideos] = useState<{ label: string; url: string }[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setUseUrl(false);
  };

  const loadExistingVideos = async () => {
    try {
      setIsLoadingVideos(true);
      const videos = await getCourseVideos(courseId);
      // Filter out current video if it exists to avoid confusion, or keep it?
      // Let's keep it so they can see it's in the list.
      setExistingVideos(videos);
    } catch (error) {
      toast.error("Impossible de charger la bibliothèque vidéo");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Enable real-time validation to update isValid
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  // Reset form when initialData changes (e.g. after router.refresh())
  useEffect(() => {
    form.reset({ videoUrl: initialData.videoUrl || "" });
  }, [initialData.videoUrl, form]);

  const { isSubmitting, isValid } = form.formState;
  const videoUrl = form.watch("videoUrl");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting video URL:", values);
      const response = await updateLesson(chapterId, courseId, lessonId, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Vidéo mise à jour");
        toggleEdit();
        router.refresh();
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      toast.error("Une erreur est survenue");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Vidéo de la leçon
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Annuler</>
          )}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une vidéo
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              url={initialData.videoUrl}
              controls
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
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
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="lessonVideo"
                          accept="video/*"
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
                <div className="text-xs text-muted-foreground mt-4">
                  Téléchargez la vidéo de cette leçon
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
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="URL de la vidéo (ex: https://...)"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // Force re-render or validation if needed
                          }}
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
                    onClick={() => console.log("Submit button clicked")}
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
                
                {videoUrl && !isSubmitting && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Aperçu :</p>
                    <div className="relative aspect-video bg-slate-100 rounded-md overflow-hidden">
                      <ReactPlayer
                        url={videoUrl}
                        controls
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Ou choisir depuis la bibliothèque du cours</p>
                  <Select
                    onValueChange={(url) => {
                      form.setValue("videoUrl", url, { shouldValidate: true, shouldDirty: true });
                    }}
                    disabled={isLoadingVideos}
                  >
                    <SelectTrigger onClick={() => {
                      if (existingVideos.length === 0) loadExistingVideos();
                    }}>
                      <SelectValue placeholder="Sélectionner une vidéo existante" />
                    </SelectTrigger>
                    <SelectContent>
                      {existingVideos.length === 0 && !isLoadingVideos && (
                        <div className="p-2 text-sm text-muted-foreground">Aucune vidéo trouvée</div>
                      )}
                      {existingVideos.map((video, idx) => (
                        <SelectItem key={idx} value={video.url}>
                          {video.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Les vidéos peuvent prendre quelques minutes pour être traitées. Rafraîchissez la page si la vidéo n'apparaît pas.
        </div>
      )}
    </div>
  )
}
