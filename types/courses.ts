import { User } from "./auth";

/**
 * Statut de publication d'un contenu
 */
export type PublishStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Catégorie de cours (ex: Développement Web, Design, IA)
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string; // Pour des URLs propres : /categories/developpement-web
}

/**
 * Leçon individuelle : l'unité la plus petite
 */
export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  videoUrl?: string;     // URL du stockage (S3/Uploadthing)
  content?: string;      // Pour du texte riche / Markdown
  isFree: boolean;       // Aperçu gratuit avant achat
  position: number;      // Pour l'ordre d'affichage
  status: PublishStatus;
}

/**
 * Chapitre : Groupe de leçons
 */
export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  position: number;
  status: PublishStatus;
  lessons: Lesson[];
}

/**
 * Cours complet : Le cœur du système
 */
export interface Course {
  id: string;
  instructorId: string; // ID du User avec le rôle INSTRUCTOR
  instructor?: User;
  categoryId: string;
  category?: Category;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string; // Pour les cartes de présentation
  imageUrl?: string;
  price: number;
  status: PublishStatus;
  chapters: Chapter[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Types spécifiques pour les formulaires (DTO)
 * Évite d'envoyer tout l'objet quand on crée juste un titre
 */
export type CreateCourseDTO = {
  title: string;
  categoryId: string;
};

export type UpdateCourseDTO = Partial<Omit<Course, "id" | "instructorId">>;

export type CreateChapterDTO = {
  title: string;
  courseId: string;
};

export type CreateLessonDTO = {
  title: string;
  chapterId: string;
};