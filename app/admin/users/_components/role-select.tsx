"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleSelectProps {
  userId: string;
  initialRole: UserRole;
}

export const RoleSelect = ({ userId, initialRole }: RoleSelectProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onRoleChange = async (role: UserRole) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/admin/users/${userId}`, { role });
      toast.success("Rôle mis à jour", {
        action: {
          label: "Annuler",
          onClick: async () => {
            try {
              setIsLoading(true);
              await axios.patch(`/api/admin/users/${userId}`, { role: initialRole });
              toast.success("Modification annulée");
              router.refresh();
            } catch {
              toast.error("Impossible d'annuler la modification");
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
    <Select
      disabled={isLoading}
      onValueChange={onRoleChange}
      defaultValue={initialRole}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Sélectionner un rôle" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="STUDENT">Étudiant</SelectItem>
        <SelectItem value="INSTRUCTOR">Instructeur</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};
