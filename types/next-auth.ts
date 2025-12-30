import { UserRole } from "@/types/auth"; // Vérifie que le chemin pointe bien vers ton fichier unifié
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Étend l'objet session retourné par useSession() ou auth()
   */
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  /**
   * Étend l'objet User retourné par les providers et l'adapter.
   * On utilise 'role?' pour ne pas entrer en conflit avec l'Adapter Prisma
   */
  interface User {
    id: string;
    role: UserRole; // Rendu optionnel pour la compatibilité Adapter
    password?: string | null; 
  }
}

declare module "next-auth/jwt" {
  /**
   * Étend le jeton JWT (nécessaire pour les callbacks jwt et session)
   */
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}