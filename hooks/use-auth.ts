import { useSession } from "next-auth/react";
import { UserRole } from "@/types";

/**
 * Hook pour gérer l'état d'authentification et les permissions
 * de TANKAACADEMY de manière centralisée.
 */
export const useAuth = () => {
  const { data: session, status } = useSession();

  // États de base
  const user = session?.user;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Rôles spécifiques (Basés sur l'enum UserRole)
  const isAdmin = user?.role === UserRole.ADMIN;
  const isInstructor = user?.role === UserRole.INSTRUCTOR;
  const isStudent = user?.role === UserRole.STUDENT;

  // Permissions combinées
  // Un Admin a souvent les mêmes droits qu'un Instructeur + des droits de gestion
  const canCreateCourse = isAdmin || isInstructor;
  const canAccessAdminPanel = isAdmin;
  const canPurchase = isStudent || !isAuthenticated; // Un invité peut aussi voir le bouton d'achat

  return {
    // Données utilisateur
    user,
    userId: user?.id,
    userEmail: user?.email,
    userImage: user?.image,
    userName: user?.name,
    userRole: user?.role,

    // États de chargement
    isLoading,
    isAuthenticated,

    // Rôles
    isAdmin,
    isInstructor,
    isStudent,

    // Permissions d'interface
    canCreateCourse,
    canAccessAdminPanel,
    canPurchase,
  };
};