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
  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((current) => !current);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await updateLesson(chapterId, courseId, lessonId, values);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Vidéo mise à jour");
        setIsEditing(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Vidéo de la leçon
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
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
              Modifier la vidéo
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              url={initialData.videoUrl}
              controls
              width="100%"
              height="100%"
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
           <FileUpload
             endpoint="lessonVideo"
             accept="video/*"
             onChange={(url) => {
               if (url) {
                 onSubmit({ videoUrl: url });
               }
             }}
           />
           <div className="text-xs text-muted-foreground mt-4">
             Note: L'upload est géré par Cloudinary. L'enregistrement se fera automatiquement une fois terminé.
           </div>
        </div>
      )}
    </div>
  );
};