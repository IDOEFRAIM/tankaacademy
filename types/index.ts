// 1. Exportation des rôles et de la sécurité (Enum UserRole, etc.)
export * from "./auth";

// 2. Exportation de l'extension de module pour NextAuth (Session, User, JWT)
// Note : On l'exporte pour que TS traite les augmentations de modules globalement
export * from "./next-auth";

// 3. Exportation de la structure pédagogique (Cours, Chapitres, Leçons)
export * from "./courses";

// 4. Exportation des profils, de la progression et des achats
export * from "./user";

/**
 * Types Utilitaires Globaux
 * Utilisés pour uniformiser les réponses des Services et Server Actions
 */

// Pour gérer les réponses de tes API ou Services de manière uniforme
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pour la pagination (utile pour la liste des cours ou des élèves)
export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}