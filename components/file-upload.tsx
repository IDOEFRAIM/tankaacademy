"use client";

import { UploadCloud, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { getUploadLimit } from "@/actions/get-system-settings";

interface FileUploadProps {
  onChange: (url: string) => void;
  endpoint?: string;
  accept?: string;
}

export const FileUpload = ({
  onChange,
  endpoint,
  accept
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [maxSize, setMaxSize] = useState<number>(2 * 1024 * 1024 * 1024); // Default 2GB

  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const limit = await getUploadLimit();
        setMaxSize(limit);
      } catch (error) {
        console.error("Failed to fetch upload limit", error);
      }
    };
    fetchLimit();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validation du type de fichier si 'accept' est fourni
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      
      // Gestion des wildcards comme 'image/*' ou 'video/*'
      const isValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0];
          return fileType.startsWith(`${baseType}/`);
        }
        return fileType === type;
      });

      if (!isValid) {
        toast.error(`Type de fichier invalide. Attendu : ${accept}`);
        return;
      }
    }

    // Limite de taille dynamique
    if (file.size > maxSize) {
      const maxSizeGB = (maxSize / (1024 * 1024 * 1024)).toFixed(2);
      toast.error(`Le fichier est trop volumineux. La taille maximale est de ${maxSizeGB} Go.`);
      return;
    }

    setIsUploading(true);

    try {
      // Send file as raw binary data to avoid FormData memory overhead
      const response = await axios.post("/api/upload", file, {
        headers: {
          "Content-Type": file.type,
          "X-File-Name": encodeURIComponent(file.name) // Encode to handle special chars
        }
      });
      
      onChange(response.data.url);
      toast.success("Fichier téléchargé !");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 413) {
        toast.error("Fichier trop volumineux pour le serveur.");
      } else {
        toast.error("Erreur lors du téléchargement");
      }
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 transition">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          )}
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Cliquez pour uploader</span>
          </p>
          <p className="text-xs text-gray-500">
            {accept ? `Fichiers acceptés : ${accept}` : "Tous fichiers"}
          </p>
        </div>
        <input 
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={onUpload}
            disabled={isUploading}
        />
      </label>
    </div>
  );
};
