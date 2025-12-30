"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface VideoWrapperProps {
  children: React.ReactNode;
}

export const VideoWrapper = ({ children }: VideoWrapperProps) => {
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    // You might need to communicate this state up to the layout if you want to hide the sidebar
    // For now, we'll just expand within the container
    document.body.classList.toggle("theater-mode", !isTheaterMode);
  };

  return (
    <div className={cn(
      "relative transition-all duration-300 ease-in-out group",
      isTheaterMode ? "w-full h-[80vh]" : "w-full aspect-video"
    )}>
      {children}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={toggleTheaterMode}
      >
        {isTheaterMode ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
      </Button>
    </div>
  );
};
