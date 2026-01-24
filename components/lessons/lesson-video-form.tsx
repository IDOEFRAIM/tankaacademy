// @ts-nocheck
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, PlusCircle, Video, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateLesson } from "@/actions/lessons";
import { FileUpload } from "@/components/file-upload"; 
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
  const [isUploading, setIsUploading] = useState(false);
  const [existingVideos, setExistingVideos] = useState<{ label: string; url: string }[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
    setUseUrl(false);
    setVideoTitle("");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || "",
    },
  });

  useEffect(() => {
    form.reset({ videoUrl: initialData.videoUrl || "" });
  }, [initialData.videoUrl, form]);

  const { isSubmitting, isValid } = form.formState;

  // 1. Sauvegarde finale dans la DB Neon
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await updateLesson(chapterId, courseId, lessonId, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Leçon mise à jour");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement");
    }
  };

  // 2. Logique d'upload DIRECT (Client -> Bunny.net)
  const handleBunnyUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const toastId = toast.loading("1. Initialisation de la vidéo...");

      // A. Demander un ID à ton API Next.js (JSON léger)
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: videoTitle || file.name }),
      });
      
      const { videoId, libraryId } = await res.json();
      if (!videoId) throw new Error("ID de vidéo non reçu");

      // B. Upload avec XMLHttpRequest pour le suivi et la stabilité
      // Dans handleBunnyUpload dans lesson-video-form.tsx
     return new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  
  // 1. Initialisation de la requête
  xhr.open("PUT", `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`, true);
  
  // 2. Sécurité : Assurez-vous que cette clé est bien définie dans votre .env.local
  // Note : NEXT_PUBLIC rend la clé visible dans le navigateur. 
  // Veillez à restreindre les domaines autorisés (CORS) dans votre interface Bunny.net.
  const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY;
  
  if (!apiKey) {
    reject(new Error("Clé API Bunny manquante"));
    return;
  }

  xhr.setRequestHeader("AccessKey", apiKey);

  // 3. Gestion de la progression
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      // On garde 99% tant que le serveur n'a pas validé la fin du transfert
      const displayPercent = percent === 100 ? 99 : percent;
      toast.loading(`Upload en cours : ${displayPercent}%`, { id: toastId });
    }
  };

  // 4. Réponse du serveur
  xhr.onload = async () => {
    if (xhr.status === 200) {
      toast.loading("Finalisation et enregistrement...", { id: toastId });
      
      try {
        const finalUrl = `https://iframe.mediadelivery.net/play/${libraryId}/${videoId}`;
        
        // On attend que la DB soit mise à jour avant de crier victoire
        await onSubmit({ videoUrl: finalUrl });
        
        toast.success("Vidéo enregistrée avec succès !", { id: toastId });
        resolve(true);
      } catch (dbError) {
        reject(new Error("Erreur lors de la sauvegarde en base de données"));
      }
    } else {
      // Analyse de l'erreur Bunny (ex: 401 = mauvaise clé, 403 = domaine non autorisé)
      console.error("Réponse Bunny :", xhr.status, xhr.responseText);
      reject(new Error(`Le serveur Bunny a répondu : ${xhr.status}`));
    }
  };

  // 5. Gestion des erreurs réseau
  xhr.onerror = () => {
    reject(new Error("Erreur réseau : Vérifiez votre connexion ou les paramètres CORS"));
  };

  // 6. Envoi
  xhr.send(file);
});

    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const loadExistingVideos = async () => {
    try {
      setIsLoadingVideos(true);
      const videos = await getCourseVideos(courseId);
      setExistingVideos(videos);
    } catch (error) {
      toast.error("Erreur lors du chargement de la bibliothèque");
    } finally {
      setIsLoadingVideos(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Vidéo de la leçon
        <Button onClick={toggleEdit} variant="ghost" disabled={isUploading}>
          {isEditing ? "Annuler" : (
            !initialData.videoUrl ? (
              <><PlusCircle className="h-4 w-4 mr-2" /> Ajouter</>
            ) : (
              <><Pencil className="h-4 w-4 mr-2" /> Modifier</>
            )
          )}
        </Button>
      </div>

      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md mt-2">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2 overflow-hidden rounded-md">
            <ReactPlayer
              url={initialData.videoUrl}
              controls
              width="100%"
              height="100%"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>
        )
      )}

      {isEditing && (
        <div className="mt-4">
          {!useUrl ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Titre pour Bunny.net (optionnel)</label>
                <Input
                  placeholder="Ex: Introduction au cours"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <FileUpload
                endpoint="lessonVideo"
                accept="video/*"
                onChange={(url, file) => {
                  if (file) handleBunnyUpload(file);
                }}
              />
              
              {isUploading && (
                <div className="flex flex-col items-center justify-center p-4 gap-y-2 bg-white rounded-md border">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-700" />
                  <p className="text-sm font-medium text-slate-600">
                    Upload direct en cours...
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Le fichier ne passe pas par votre serveur (Bypass 10MB limit)
                  </p>
                </div>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs text-slate-500 hover:text-sky-700"
                onClick={() => setUseUrl(true)}
                disabled={isUploading}
              >
                Ou utiliser une URL existante / Bibliothèque
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Collez l'URL de la vidéo (Bunny, YouTube...)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2 border-t mt-4">
                   <p className="text-xs font-bold text-slate-700 mb-2">Choisir depuis ce cours :</p>
                   <Select
                    onValueChange={(url) => form.setValue("videoUrl", url, { shouldValidate: true })}
                   >
                    <SelectTrigger 
                        disabled={isLoadingVideos}
                        onClick={() => existingVideos.length === 0 && loadExistingVideos()}
                    >
                      <SelectValue placeholder={isLoadingVideos ? "Chargement..." : "Sélectionner une vidéo existante"} />
                    </SelectTrigger>
                    <SelectContent>
                      {existingVideos.length > 0 ? (
                        existingVideos.map((video, idx) => (
                            <SelectItem key={idx} value={video.url}>{video.label}</SelectItem>
                        ))
                      ) : (
                        <p className="p-2 text-xs text-center text-slate-500">Aucune vidéo trouvée</p>
                      )}
                    </SelectContent>
                   </Select>
                </div>

                <div className="flex items-center gap-x-2">
                  <Button disabled={!isValid || isSubmitting} type="submit">
                    Enregistrer
                  </Button>
                  <Button variant="ghost" onClick={() => setUseUrl(false)}>
                    Retour à l'upload
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  );
};