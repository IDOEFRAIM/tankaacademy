"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Trash, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { deleteComment } from "@/actions/comments";

interface CommentItemProps {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  currentUserId?: string;
}

export const CommentItem = ({
  id,
  content,
  createdAt,
  user,
  currentUserId,
}: CommentItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteComment(id, pathname);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Commentaire supprimé");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = currentUserId === user.id;

  return (
    <div className="flex gap-x-4 py-4 border-b last:border-0">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.image || ""} />
        <AvatarFallback className="bg-sky-100 text-sky-700">
          {user.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-x-2">
            <p className="font-semibold text-sm">{user.name || "Utilisateur"}</p>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: fr })}
            </span>
          </div>
          {isOwner && (
            <ConfirmModal onConfirm={onDelete}>
              <Button
                size="sm"
                variant="ghost"
                className="h-auto p-1 text-muted-foreground hover:text-rose-600"
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </ConfirmModal>
          )}
        </div>
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
