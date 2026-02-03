"use client";

import { UploadCloud, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CldUploadButton } from "next-cloudinary";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint?: string;
  accept?: string;
}

export const FileUpload = ({
  onChange,
  accept,
}: FileUploadProps) => {
  // For very large videos, use server-side streaming upload
  if (accept === "video/*") {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [eta, setEta] = useState<string>("");
    const [xhrRef, setXhrRef] = useState<XMLHttpRequest | null>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      setProgress(0);
      setEta("");
      const start = Date.now();

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload-video");
      xhr.setRequestHeader("X-Filename", file.name);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.upload.onprogress = (ev) => {
        const total = file.size;
        const loaded = ev.loaded;
        if (total > 0) {
          const pct = Math.round((loaded / total) * 100);
          setProgress(Math.min(100, pct));
          const elapsed = (Date.now() - start) / 1000; // seconds
          const speed = loaded / elapsed; // bytes/sec
          const remainingBytes = Math.max(0, total - loaded);
          const remainingSec = speed > 0 ? remainingBytes / speed : 0;
          const mins = Math.floor(remainingSec / 60);
          const secs = Math.floor(remainingSec % 60);
          setEta(`${mins}m ${secs}s`);
        }
      };
      setXhrRef(xhr);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          setUploading(false);
          try {
            const data = JSON.parse(xhr.responseText || "{}");
            if (xhr.status >= 200 && xhr.status < 300 && data?.url) {
              onChange(data.url);
              toast.success("Upload terminé");
            } else {
              toast.error(data?.error || "Echec de l'upload");
            }
          } catch (err) {
            toast.error("Réponse invalide du serveur");
          }
        }
      };
      xhr.send(file);
    };

    return (
      <label className="flex flex-col items-center justify-center p-10 transition border-2 border-dashed rounded-md border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer w-full">
        <UploadCloud className="w-10 h-10 mb-3 text-slate-400 group-hover:text-sky-600 transition" />
        <div className="font-semibold text-slate-600">Choisir une vidéo (upload serveur)</div>
        {uploading && (
          <div className="mt-4 w-full max-w-sm">
            <div className="h-2 bg-slate-200 rounded">
              <div className="h-2 bg-sky-600 rounded" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-slate-500 mt-1 flex justify-between">
              <span>{progress}%</span>
              <span>{eta && `ETA ${eta}`}</span>
            </div>
            <button
              type="button"
              className="mt-2 text-xs px-2 py-1 border rounded hover:bg-slate-100"
              onClick={() => {
                xhrRef?.abort();
                setUploading(false);
                setProgress(0);
                setEta("");
                toast.error("Upload annulé");
              }}
            >
              Annuler
            </button>
          </div>
        )}
        <input type="file" accept="video/*" className="hidden" onChange={handleFile} />
      </label>
    );
  }

  // Default: Cloudinary widget for images and small assets
  return (
    <CldUploadButton
      onSuccess={(result: any) => {
        onChange(result.info.secure_url);
      }}
      options={{
        maxFiles: 1,
        resourceType: "image",
      }}
      uploadPreset="tankacademy_signed"
      signatureEndpoint="/api/sign-cloudinary-params"
    >
      <div className="flex flex-col items-center justify-center p-10 transition border-2 border-dashed rounded-md border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
        <UploadCloud className="w-10 h-10 mb-3 text-slate-400 group-hover:text-sky-600 transition" />
        <div className="font-semibold text-slate-600">Cliquez pour uploader (Cloudinary)</div>
      </div>
    </CldUploadButton>
  );
};