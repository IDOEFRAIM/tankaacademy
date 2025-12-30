import { UserRole } from "./auth";
import { Course } from "./courses";

/**
 * Profil détaillé pour les formateurs et les élèves
 */
export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  headline?: string;    // Ex: "Expert en Intelligence Artificielle"
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

/**
 * Progression d'un élève sur une leçon spécifique
 */
export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: Date;
}

/**
 * Inscription d'un élève à un cours (Achat/Accès)
 */
export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  createdAt: Date;
}

/**
 * Type agrégé pour afficher le Dashboard d'un élève
 */
export interface StudentDashboardData {
  enrolledCourses: (Course & {
    progress: number; // Pourcentage calculé (0 à 100)
    chaptersCount: number;
  })[];
}

/**
 * Type pour le profil public d'un formateur (ce que les élèves voient)
 */
export interface InstructorProfilePublic {
  name: string;
  image?: string;
  bio?: string;
  headline?: string;
  coursesCount: number;
  totalStudents: number;
}