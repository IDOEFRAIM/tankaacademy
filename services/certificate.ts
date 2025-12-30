import { prisma } from "@/lib/prisma";
import { ProgressService } from "./progress";

export const CertificateService = {
  /**
   * Vérifie si un utilisateur est éligible pour un certificat (100% de progression)
   */
  async checkCertificateEligibility(userId: string, courseId: string): Promise<boolean> {
    const progress = await ProgressService.getCourseProgress(userId, courseId);
    return progress === 100;
  },

  /**
   * Récupère les données nécessaires pour générer le certificat
   */
  async getCertificateData(userId: string, courseId: string) {
    const isEligible = await this.checkCertificateEligibility(userId, courseId);
    
    if (!isEligible) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { 
        title: true,
        instructor: {
          select: { name: true }
        }
      }
    });

    if (!user || !course) {
      return null;
    }

    return {
      studentName: user.name || "Étudiant",
      courseTitle: course.title,
      instructorName: course.instructor.name || "Instructeur Tanka Academy",
      completionDate: new Date(),
    };
  }
};
