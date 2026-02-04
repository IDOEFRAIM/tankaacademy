"use client";

import { UploadCloud, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint?: string;
  accept?: string;
}

export const FileUpload = ({
  onChange,
  accept,
}: FileUploadProps) => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  // For videos: use backend API for large file support
  if (accept === "video/*") {
    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setProgress(0);

      try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            onChange(result.url);
            toast.success("Vidéo uploadée avec succès");
          } else {
            console.error(xhr.responseText);
            toast.error("Erreur lors de l'upload");
          }
          setUploading(false);
        });

        xhr.addEventListener("error", () => {
          toast.error("Erreur réseau");
          setUploading(false);
        });

        xhr.open("POST", "/api/upload-video");
        xhr.setRequestHeader("X-File-Name", file.name);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      } catch (error) {
        toast.error("Erreur lors de l'upload");
        setUploading(false);
      }
    };

    const handleUrlSubmit = () => {
      if (customUrl) {
        onChange(customUrl);
        toast.success("Lien ajouté");
      }
    };

    return (
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="url">Lien Externe</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <label className="flex flex-col items-center justify-center p-10 transition border-2 border-dashed rounded-md border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer w-full mt-2">
            <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
            <div className="font-semibold text-slate-600">Choisir une vidéo</div>
            <div className="text-xs text-slate-500 mt-1">Jusqu'à 2 GB</div>
            {uploading && (
              <div className="mt-4 w-full max-w-sm">
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div className="h-2 bg-sky-600" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-xs text-slate-500 mt-1">{progress}%</div>
              </div>
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploading}
            />
          </label>
        </TabsContent>
        <TabsContent value="url">
          <div className="p-4 border rounded-md mt-2 flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <LinkIcon className="h-4 w-4 mr-2" />
              <Input
                placeholder="Coller l'URL de la vidéo ici..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                disabled={uploading}
              />
              <Button onClick={handleUrlSubmit} disabled={!customUrl || uploading} type="button">
                Ajouter
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Vous pouvez héberger votre vidéo ailleurs (YouTube, Vimeo, S3...) et coller le lien ici.
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }

  // For images: use Cloudinary widget (small files)
  return (
    <CldUploadButton
      onSuccess={(result: any) => {
        onChange(result.info.secure_url);
        toast.success("Image uploadée");
      }}
      onError={() => {
        toast.error("Erreur lors de l'upload");
      }}
      options={{
        maxFiles: 1,
        resourceType: "image",
      }}
      uploadPreset="tankacademy_signed"
      signatureEndpoint="/api/sign-cloudinary-params"
    >
      <div className="flex flex-col items-center justify-center p-10 transition border-2 border-dashed rounded-md border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer w-full">
        <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
        <div className="font-semibold text-slate-600">Choisir une image</div>
      </div>
    </CldUploadButton>
  );
};