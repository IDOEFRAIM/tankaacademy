"use client";

import { CommentItem } from "./comment-item";

interface CommentListProps {
  items: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  currentUserId?: string;
}

export const CommentList = ({ items, currentUserId }: CommentListProps) => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="font-semibold text-lg">Discussions ({items.length})</h3>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground italic">
          Soyez le premier à commenter cette leçon !
        </p>
      )}
      <div className="flex flex-col">
        {items.map((item) => (
          <CommentItem
            key={item.id}
            id={item.id}
            content={item.content}
            createdAt={item.createdAt}
            user={item.user}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};
