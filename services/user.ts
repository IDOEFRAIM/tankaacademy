import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Changement ici : on utilise ton instance avec l'adaptateur
import { UserRole } from "@/types";
import { ProgressService } from "./progress";

export const UserService = {
  /**
   * AUTHENTIFICATION & COMPTES
   */

  async getUserByEmail(email: string) {
    try {
      // On utilise prisma (et non db)
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error("[GET_USER_BY_EMAIL_ERROR]", error);
      return null;
    }
  },

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || UserRole.STUDENT, 
      },
    });
  },

  /**
   * ACCÈS & INSCRIPTIONS
   */

  async hasAccess(userId: string | undefined, courseId: string): Promise<boolean> {
    if (!userId) return false;

    // Utilisation de prisma.user et prisma.course
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { instructorId: true }
    });

    if (user?.role === UserRole.ADMIN || course?.instructorId === userId) {
      return true;
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    return !!purchase;
  },

  async enrollStudent(userId: string, courseId: string) {
    return await prisma.purchase.create({
      data: { userId, courseId },
    });
  },

  /**
   * STATISTIQUES & COURS INSCRITS
   */

  async getEnrolledCourses(userId: string) {
    const purchases = await prisma.purchase.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            chapters: {
              where: { status: "PUBLISHED" },
              include: { 
                lessons: { 
                  where: { status: "PUBLISHED" },
                  select: { id: true } 
                } 
              },
            },
          },
        },
      },
    });

    const coursesWithProgress = await Promise.all(
      purchases.map(async (p: any) => {
        const progress = await ProgressService.getCourseProgress(userId, p.courseId);
        return {
          ...p.course,
          progress,
        };
      })
    );

    return coursesWithProgress;
  },
};