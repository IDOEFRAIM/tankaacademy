"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = 20,
}: StarRatingProps) => {
  return (
    <div className="flex items-center gap-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={cn(
            "transition hover:scale-110",
            readOnly && "cursor-default hover:scale-100"
          )}
        >
          <Star
            size={size}
            className={cn(
              "text-slate-300",
              star <= value && "fill-yellow-400 text-yellow-400"
            )}
          />
        </button>
      ))}
    </div>
  );
};
