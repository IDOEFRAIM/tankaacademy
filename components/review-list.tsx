"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/star-rating";

interface ReviewListProps {
  items: {
    id: string;
    rating: number;
    comment: string | null;
    user: {
      name: string | null;
      image: string | null;
    };
    createdAt: Date;
  }[];
}

export const ReviewList = ({ items }: ReviewListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Avis des étudiants ({items.length})</h3>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Aucun avis pour le moment.</p>
      )}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border rounded-md p-4">
            <div className="flex items-center gap-x-2 mb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={item.user.image || ""} />
                <AvatarFallback>
                  {item.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{item.user.name}</p>
                <StarRating value={item.rating} readOnly size={14} />
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
            <p className="text-sm text-slate-700">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
