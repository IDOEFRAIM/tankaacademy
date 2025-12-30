import * as z from "zod";
import { UserRole } from "@prisma/client";

/**
 * Schéma de Connexion (Login)
 * Utilisé pour valider les identifiants lors de l'authentification.
 */
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Une adresse email valide est requise",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est obligatoire",
  }),
});

/**
 * Schéma d'Inscription (Register)
 * Inclut la validation du rôle et la confirmation du mot de passe.
 */
export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Le nom complet ou de l'entreprise est requis",
    }),
    email: z.string().email({
      message: "Email invalide",
    }),
    password: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères",
    }),
    confirmPassword: z.string().min(6, {
      message: "Veuillez confirmer votre mot de passe",
    }),
    role: z.nativeEnum(UserRole, {
      errorMap: () => ({ message: "Veuillez sélectionner un rôle (Client, Fournisseur, etc.)" }),
    } as any),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Types exportés pour TypeScript (Utile pour Next.js 16 Server Actions)
export type LoginValues = z.infer<typeof LoginSchema>;
export type RegisterValues = z.infer<typeof RegisterSchema>;