import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials"; 

import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import { UserRole } from "@/types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Lors de la connexion initiale
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.level = (user as any).level; // <-- Ajout du level dans le token
      }
      
      // 💡 BONUS HACKATHON : Permet de mettre à jour la session instantanément 
      // quand l'élève change son niveau dans les /settings sans devoir se déconnecter !
      if (trigger === "update" && session?.level) {
        token.level = session.level;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        (session.user as any).level = token.level as string; // <-- Ajout du level dans la session accessible côté client
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

        const user = await prisma.user.findUnique({
          where: { email: email as string }
        });

        if (!user || !user.password) return null;

        if (user?.isSuspended) {
          throw new Error("AccountSuspended");
        }

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
            level: user.level, // <-- Récupération du level depuis Prisma ici
          };
        }
        
        return null;
      },
    }),
  ],
});