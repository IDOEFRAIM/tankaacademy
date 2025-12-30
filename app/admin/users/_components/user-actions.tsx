"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash, Ban, CheckCircle } from "lucide-react";
import { User } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmModal } from "@/components/modals/confirm-modal";

interface UserActionsProps {
  user: User;
}

export const UserActions = ({ user }: UserActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/admin/users/${user.id}`);
      toast.success("Utilisateur supprimé");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const onSuspend = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/admin/users/${user.id}`, {
        isSuspended: true,
        suspendedReason: suspendReason,
        suspendedAt: new Date(),
      });
      toast.success("Utilisateur suspendu", {
        action: {
          label: "Annuler",
          onClick: async () => {
            try {
              setIsLoading(true);
              await axios.patch(`/api/admin/users/${user.id}`, {
                isSuspended: false,
                suspendedReason: null,
                suspendedAt: null,
              });
              toast.success("Suspension annulée");
              router.refresh();
            } catch {
              toast.error("Impossible d'annuler la suspension");
            } finally {
              setIsLoading(false);
            }
          }
        }
      });
      setIsSuspendOpen(false);
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const onUnsuspend = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/admin/users/${user.id}`, {
        isSuspended: false,
        suspendedReason: null,
        suspendedAt: null,
      });
      toast.success("Utilisateur réactivé", {
        action: {
          label: "Annuler",
          onClick: async () => {
            try {
              setIsLoading(true);
              await axios.patch(`/api/admin/users/${user.id}`, {
                isSuspended: true,
                suspendedReason: user.suspendedReason,
                suspendedAt: user.suspendedAt,
              });
              toast.success("Réactivation annulée");
              router.refresh();
            } catch {
              toast.error("Impossible d'annuler la réactivation");
            } finally {
              setIsLoading(false);
            }
          }
        }
      });
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspendre l'utilisateur</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison de la suspension pour {user.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Raison
              </Label>
              <Input
                id="reason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>
              Annuler
            </Button>
            <Button onClick={onSuspend} disabled={isLoading || !suspendReason}>
              Suspendre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {user.isSuspended ? (
            <DropdownMenuItem onClick={onUnsuspend}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Réactiver
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setIsSuspendOpen(true)}>
              <Ban className="h-4 w-4 mr-2" />
              Suspendre
            </DropdownMenuItem>
          )}
          <ConfirmModal onConfirm={onDelete}>
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </div>
          </ConfirmModal>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
