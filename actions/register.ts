// actions/register.ts
"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas/auth";
import { UserService } from "@/services/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Champs invalides !" };
  }

  const { email, password, name, role } = validatedFields.data;

  try {
    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      return { success: false, error: "Cet email est déjà utilisé." };
    }

    // On passe le rôle choisi dans le formulaire au service
    await UserService.createUser({
      name,
      email,
      password,
      role, 
    });

    return { success: true, message: "Inscription réussie !" };
  } catch (error) {
    console.error("REGISTER_ACTION_ERROR:", error);
    return { success: false, error: "Erreur lors de la connexion à la base." };
  }
};