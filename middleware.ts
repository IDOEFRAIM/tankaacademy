import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { UserRole } from "@/types";
import { NextResponse } from "next/server";

// 1. Initialisation légère pour le Middleware (compatible Edge)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Définition des types de routes
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/auth/login", "/auth/register"].includes(nextUrl.pathname);
  const isAuthRoute = ["/auth/login", "/auth/register"].includes(nextUrl.pathname);
  const isInstructorRoute = nextUrl.pathname.startsWith("/instructor");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  // 1. Laisser passer les requêtes d'authentification API (obligatoire)
  if (isApiAuthRoute) return NextResponse.next();

  // 2. Gestion des utilisateurs CONNECTÉS sur les pages Login/Register
  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirection intelligente vers le bon Dashboard selon le rôle
      if (userRole === UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      }
      if (userRole === UserRole.INSTRUCTOR) {
        return NextResponse.redirect(new URL("/instructor", nextUrl));
      }
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // 3. Protection des routes privées (si non connecté et route non publique)
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  // 4. Protection RBAC : Routes Instructeur
  if (isInstructorRoute) {
    if (userRole !== UserRole.INSTRUCTOR && userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // 5. Protection RBAC : Routes Admin
  if (isAdminRoute) {
    if (userRole !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

// 2. Configuration du Matcher
// Filtre pour ne pas exécuter le middleware sur les fichiers statiques (images, etc.)
// Exclure également la route d'upload vidéo pour éviter la limite de taille du body (Next.js middleware limitation)
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next|api/upload-video).*)", 
    "/", 
    "/(api(?!/upload-video)|trpc)(.*)"
  ],
};