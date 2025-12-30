import { prisma } from "@/lib/prisma";

export const ProgressService = {
  /**
   * Met à jour la progression d'une leçon pour un utilisateur
   */
  async updateProgress(userId: string, lessonId: string, isCompleted: boolean) {
    return await prisma.userProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: { isCompleted },
      create: { userId, lessonId, isCompleted },
    });
  },

  /**
   * Calcule le pourcentage de progression d'un cours pour un utilisateur
   */
  async getCourseProgress(userId: string, courseId: string): Promise<number> {
    try {
      const publishedLessons = await prisma.lesson.findMany({
        where: {
          chapter: {
            courseId: courseId,
            status: "PUBLISHED",
          },
          status: "PUBLISHED",
        },
        select: { id: true },
      });

      const lessonIds = publishedLessons.map((l) => l.id);

      if (lessonIds.length === 0) return 0;

      const completedCount = await prisma.userProgress.count({
        where: {
          userId,
          lessonId: { in: lessonIds },
          isCompleted: true,
        },
      });

      return Math.round((completedCount / lessonIds.length) * 100);
    } catch (error) {
      console.error("[GET_PROGRESS]", error);
      return 0;
    }
  },
};
