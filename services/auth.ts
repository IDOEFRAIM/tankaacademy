import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/types";

export const AuthService = {
  /**
   * RÉCUPÉRATION DE SESSION
   * Permet de récupérer l'utilisateur actuel rapidement dans les Server Components ou Actions
   */
  async getCurrentUser() {
    const session = await auth();
    return session?.user;
  },

  /**
   * LOGIQUE DE RÔLES (Simple)
   */
  isAdmin: (role: UserRole | undefined) => role === UserRole.ADMIN,

  canTeach: (role: UserRole | undefined) =>
    role === UserRole.ADMIN || role === UserRole.INSTRUCTOR,

  /**
   * VÉRIFICATIONS COMPLEXES (Base de données)
   */

  // Vérifie si l'utilisateur a le droit de modifier un cours spécifique
  async canModifyCourse(courseId: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    
    if (!user || !user.id) return false;

    // 1. Les Admins peuvent tout modifier
    if (user.role === UserRole.ADMIN) return true;

    // 2. Les instructeurs ne peuvent modifier que leurs propres cours
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true },
    });

    return course?.instructorId === user.id;
  },

  /**
   * PROTECTION DE ROUTE (Côté Serveur)
   * À utiliser dans tes pages pour rediriger si non autorisé
   */
  async requireAdmin() {
    const user = await this.getCurrentUser();
    if (user?.role !== UserRole.ADMIN) {
      throw new Error("Accès refusé : Admin requis");
    }
    return user;
  },

  async requireInstructor() {
    const user = await this.getCurrentUser();
    const allowed = user?.role === UserRole.ADMIN || user?.role === UserRole.INSTRUCTOR;
    
    if (!allowed) {
      throw new Error("Accès refusé : Vous n'êtes pas instructeur");
    }
    return user;
  }
};