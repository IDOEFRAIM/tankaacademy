"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AuthService, CoursesService } from "@/services";
import { CreateCourseSchema, CourseSchema } from "@/schemas/courses";

export const createCourse = async (values: z.infer<typeof CreateCourseSchema>) => {
  try {
    // 1. Vérification des permissions (Instructeur uniquement)
    const user = await AuthService.requireInstructor();

    // 2. Validation des données
    const validatedFields = CreateCourseSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Champs invalides" };
    }

    const { title } = validatedFields.data;

    // 3. Création du cours via le service
    const course = await CoursesService.createCourse(user.id, title);

    // 4. Revalidation (optionnel si on redirige tout de suite)
    revalidatePath("/teacher/courses");

    // 5. Retourner l'ID pour la redirection côté client ou rediriger directement
    // On retourne l'objet pour laisser le client gérer la redirection (ex: toast success)
    return { success: "Cours créé avec succès", course };

  } catch (error: any) {
    console.error("[CREATE_COURSE_ACTION]", error);
    
    // Gestion des erreurs spécifiques lancées par AuthService
    if (error.message === "Accès refusé : Vous n'êtes pas instructeur") {
      return { error: "Non autorisé" };
    }

    return { error: "Une erreur est survenue lors de la création du cours" };
  }
};

export const updateCourse = async (
  courseId: string, 
  values: Partial<z.infer<typeof CourseSchema>>
) => {
  try {
    const user = await AuthService.requireInstructor();

    const course = await CoursesService.updateCourse(courseId, user.id, values);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Cours mis à jour", course };
  } catch (error) {
    console.error("[UPDATE_COURSE_ACTION]", error);
    return { error: "Impossible de mettre à jour le cours" };
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const user = await AuthService.requireInstructor();

    await CoursesService.deleteCourse(courseId, user.id);

    revalidatePath(`/instructor/courses`);

    return { success: "Cours supprimé" };
  } catch (error) {
    console.error("[DELETE_COURSE_ACTION]", error);
    return { error: "Impossible de supprimer le cours" };
  }
};

export const publishCourse = async (courseId: string) => {
  try {
    const user = await AuthService.requireInstructor();

    await CoursesService.publishCourse(courseId, user.id);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Cours publié" };
  } catch (error) {
    console.error("[PUBLISH_COURSE_ACTION]", error);
    return { error: "Impossible de publier le cours" };
  }
};

export const unpublishCourse = async (courseId: string) => {
  try {
    const user = await AuthService.requireInstructor();

    await CoursesService.unpublishCourse(courseId, user.id);

    revalidatePath(`/instructor/courses/${courseId}`);

    return { success: "Cours dépublié" };
  } catch (error) {
    console.error("[UNPUBLISH_COURSE_ACTION]", error);
    return { error: "Impossible de dépublier le cours" };
  }
};
