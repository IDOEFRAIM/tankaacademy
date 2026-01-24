"use client";

import { UploadCloud, Loader2, FileIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUploadLimit } from "@/actions/get-system-settings";

interface FileUploadProps {
  // On accepte maintenant (url, file) pour être compatible avec tous tes formulaires
  onChange: (url?: string, file?: File) => void;
  endpoint?: string;
  accept?: string;
}

export const FileUpload = ({
  onChange,
  accept,
}: FileUploadProps) => {
  const [maxSize, setMaxSize] = useState<number>(2 * 1024 * 1024 * 1024); // Par défaut 2Go
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Récupération de la limite configurée dans ton admin
  useEffect(() => {
    const fetchLimit = async () => {
      try {
        const limit = await getUploadLimit();
        if (limit) setMaxSize(limit);
      } catch (error) {
        console.error("Erreur lors de la récupération de la limite:", error);
      }
    };
    fetchLimit();
  }, []);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // 1. Validation du type (si spécifié)
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const isValid = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.split('/')[0]);
        }
        return fileType === type;
      });

      if (!isValid) {
        toast.error(`Format non supporté. Attendu : ${accept}`);
        return;
      }
    }

    // 2. Validation de la taille
    if (file.size > maxSize) {
      const maxSizeGB = (maxSize / (1024 * 1024 * 1024)).toFixed(2);
      toast.error(`Fichier trop lourd (Max: ${maxSizeGB} Go)`);
      return;
    }

    // 3. Mise à jour UI et envoi au parent
    setSelectedFileName(file.name);
    
    // On passe le fichier brut au composant parent (LessonVideoForm)
    // C'est le parent qui gérera l'upload direct vers Bunny
    onChange(undefined, file);
  };

  const resetSelection = () => {
    setSelectedFileName(null);
    onChange(undefined, undefined);
  };

  return (
    <div className="w-full">
      {!selectedFileName ? (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-slate-300 transition group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className="w-10 h-10 mb-3 text-slate-400 group-hover:text-sky-600 transition" />
            <p className="mb-2 text-sm text-slate-600">
              <span className="font-semibold">Cliquez pour sélectionner</span> ou glissez un fichier
            </p>
            <p className="text-xs text-slate-500 italic">
              {accept === "video/*" ? "Vidéo uniquement (MP4, WebM...)" : "Tous fichiers supportés"}
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Limite : {(maxSize / (1024 * 1024 * 1024)).toFixed(1)} Go
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept={accept}
            onChange={onSelectFile}
          />
        </label>
      ) : (
        <div className="flex items-center p-3 w-full bg-sky-50 border border-sky-200 rounded-md">
          <FileIcon className="h-4 w-4 fill-sky-200 stroke-sky-700 mr-2" />
          <span className="text-sm text-sky-700 truncate flex-1">
            {selectedFileName}
          </span>
          <button 
            onClick={resetSelection}
            className="ml-auto hover:opacity-75 transition"
          >
            <X className="h-4 w-4 text-sky-700" />
          </button>
        </div>
      )}
    </div>
  );
};