import { db } from "@/lib/db";

export const PurchaseService = {
  /**
   * Vérifie si un utilisateur a acheté un cours
   * @param userId ID de l'utilisateur (peut être null/undefined)
   * @param courseId ID du cours
   * @returns boolean
   */
  async checkCourseAccess(userId: string | null | undefined, courseId: string) {
    if (!userId) {
      return false;
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return !!purchase;
  },

  /**
   * Récupère tous les achats d'un utilisateur
   * @param userId ID de l'utilisateur
   * @returns Liste des achats avec les détails du cours
   */
  async getUserEnrollments(userId: string) {
    return await db.purchase.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
