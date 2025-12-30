"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { AuthService } from "@/services";
import { PurchaseService } from "@/services/purchase";

export const checkout = async (courseId: string) => {
  try {
    const user = await AuthService.getCurrentUser();

    if (!user || !user.id || !user.email) {
      return { error: "Non autorisé" };
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        status: "PUBLISHED",
      }
    });

    if (!course) {
      return { error: "Cours introuvable" };
    }

    const hasAccess = await PurchaseService.checkCourseAccess(user.id, courseId);

    if (hasAccess) {
      return { error: "Déjà inscrit" };
    }

    // MOCK PURCHASE - In a real app, this would be a Stripe session creation
    await db.purchase.create({
      data: {
        courseId: courseId,
        userId: user.id,
        price: course.price || 0, // Enregistre le prix au moment de l'achat
      }
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.log("[CHECKOUT]", error);
    return { error: "Erreur interne" };
  }
}
