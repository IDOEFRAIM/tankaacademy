import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-sky-700" />
      <p className="text-muted-foreground text-sm animate-pulse">Chargement de votre espace...</p>
    </div>
  );
}
