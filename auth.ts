import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials"; // <--- NE PAS OUBLIER CET IMPORT

import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import { UserRole } from "@/types/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        // Recherche utilisateur
        const user = await prisma.user.findUnique({
          where: { email: email as string }
        });

        // Sécurité : pas de user ou compte OAuth (sans password)
        if (!user || !user.password) return null;

        // Vérification si le compte est suspendu
        if (user?.isSuspended) {
          throw new Error("AccountSuspended");
        }

        // Vérification mot de passe
        const isPasswordCorrect = await bcrypt.compare(
          password as string,
          user.password
        );

        if (isPasswordCorrect) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole, 
          };
        }
        
        return null;
      },
    }),
  ],
});