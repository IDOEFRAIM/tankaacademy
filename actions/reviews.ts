"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PurchaseService } from "@/services/purchase";
import { revalidatePath } from "next/cache";

export const createReview = async (courseId: string, rating: number, comment: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Non autorisé" };
    }

    const hasAccess = await PurchaseService.checkCourseAccess(userId, courseId);

    if (!hasAccess) {
      return { error: "Vous devez acheter ce cours pour laisser un avis" };
    }

    const existingReview = await db.review.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    });

    if (existingReview) {
      return { error: "Vous avez déjà laissé un avis pour ce cours" };
    }

    await db.review.create({
      data: {
        userId,
        courseId,
        rating,
        comment,
      }
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: "Avis ajouté avec succès" };
  } catch (error) {
    console.log("[CREATE_REVIEW]", error);
    return { error: "Une erreur est survenue" };
  }
}

export const getReviews = async (courseId: string) => {
  try {
    const reviews = await db.review.findMany({
      where: {
        courseId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return reviews;
  } catch (error) {
    console.log("[GET_REVIEWS]", error);
    return [];
  }
}
