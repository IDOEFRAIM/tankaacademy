/**
 * types/auth.ts
 * Centralisation des types d'authentification pour TANKAACADEMY
 * SÉCURISÉ POUR LE MIDDLEWARE (EDGE RUNTIME)
 */

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * 1. DÉFINITION DES RÔLES
 * IMPORTANT : On définit l'Enum manuellement ici au lieu de l'importer de Prisma.
 * Cela permet d'utiliser ce fichier dans le Middleware sans faire planter le serveur.
 */
export enum UserRole {
  STUDENT = "STUDENT",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

/**
 * Interface de l'utilisateur (Reflet de la DB)
 */
export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password?: string | null; 
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 2. EXTENSION DES TYPES NEXTAUTH (Module Augmentation)
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // On utilise '?' pour la compatibilité avec l'Adapter Prisma
    role?: UserRole;
    password?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

/**
 * 3. PROTECTION DES ROUTES (RBAC)
 */
export type AuthPermission = {
  canManageCourses: boolean;    // INSTRUCTOR, ADMIN
  canAccessAdminPanel: boolean;  // ADMIN
  canViewAnalytics: boolean;     // INSTRUCTOR, ADMIN
  canBuyCourses: boolean;        // STUDENT
};

/**
 * Helper de permissions
 */
export const getPermissionsByRole = (role: UserRole): AuthPermission => {
  return {
    canManageCourses: role === UserRole.INSTRUCTOR || role === UserRole.ADMIN,
    canAccessAdminPanel: role === UserRole.ADMIN,
    canViewAnalytics: role === UserRole.INSTRUCTOR || role === UserRole.ADMIN,
    canBuyCourses: role === UserRole.STUDENT,
  };
};

/**
 * 4. RÉPONSE STANDARD DES ACTIONS
 */
export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
};