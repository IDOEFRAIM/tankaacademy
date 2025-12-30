"use server";

import { z } from "zod";
import { AuthError } from "next-auth"; // Correction : Importation nommée, pas par défaut

import { signIn } from "@/auth"; 
import { LoginSchema } from "@/schemas/auth";
import { ApiResponse } from "@/types";

export const login = async (
  values: z.infer<typeof LoginSchema>
): Promise<ApiResponse<any>> => {
  // 1. Validation Zod
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Champs invalides" };
  }

  const { email, password } = validatedFields.data;

  try {
    // 2. Connexion via NextAuth
    // C'est ici que NextAuth appelle ta fonction 'authorize' définie dans auth.ts
    // Cette fonction 'authorize' utilisera ton instance 'prisma' avec l'adaptateur pg.
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/", 
    });

    return { success: true, message: "Connexion réussie" };
  } catch (error) {
    // 3. Gestion des erreurs spécifiques
    if (error instanceof AuthError) {
      // Gestion de l'erreur personnalisée de suspension
      // @ts-ignore
      if (error.cause?.err?.message === "AccountSuspended") {
        return { success: false, error: "Votre compte a été suspendu. Veuillez contacter l'administrateur." };
      }

      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Identifiants invalides !" };
        case "CallbackRouteError":
          return { success: false, error: "Erreur de connexion à la base de données." };
        default:
          return { success: false, error: "Une erreur est survenue lors de l'authentification." };
      }
    }

    /**
     * IMPORTANT POUR NEXT.JS 16 :
     * NextAuth utilise les erreurs pour gérer les redirections internes.
     * Si vous ne relancez pas l'erreur, la redirection automatique après login ne fonctionnera pas.
     */
    throw error;
  }
};