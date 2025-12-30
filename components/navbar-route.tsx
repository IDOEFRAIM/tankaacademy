"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assumes Shadcn
import { LogOut, Layout, ShieldCheck } from "lucide-react";
import { UserRole } from "@/types";
import { UserMenu } from "@/components/user-menu";

interface NavbarRoutesProps {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
    role?: UserRole;
  };
}

export const NavbarRoutes = ({ user }: NavbarRoutesProps) => {
  const pathname = usePathname();

  const isInstructorPage = pathname?.startsWith("/instructor");
  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.includes("/courses");

  return (
    <div className="flex gap-x-2 ml-auto">
      {/* 1. BOUTON MODE INSTRUCTEUR / QUITTER */}
      {isInstructorPage || isAdminPage ? (
        <div className="flex gap-x-2">
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <Layout className="h-4 w-4 mr-2" />
              Mon Apprentissage
            </Button>
          </Link>
          <Link href="/">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Quitter le mode gestion
            </Button>
          </Link>
        </div>
      ) : isPlayerPage ? (
        <Link href="/dashboard">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Quitter le cours
          </Button>
        </Link>
      ) : (
        <div className="flex gap-x-2">
          {user && (
            <Link href="/dashboard">
              <Button size="sm" variant="ghost">
                Mon Apprentissage
              </Button>
            </Link>
          )}
          {user?.role === UserRole.INSTRUCTOR || user?.role === UserRole.ADMIN ? (
            <Link href="/instructor/courses">
              <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Espace Formateur
              </Button>
            </Link>
          ) : null}
        </div>
      )}

      {/* 2. ACCÈS ADMIN RAPIDE */}
      {user?.role === UserRole.ADMIN && !isAdminPage && (
        <Link href="/admin">
          <Button size="sm" variant="ghost" className="text-rose-600">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </Link>
      )}

      {/* 3. AUTHENTIFICATION */}
      {!user ? (
        <div className="flex items-center gap-x-2">
          <Link href="/auth/login">
            <Button size="sm" variant="ghost">Connexion</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">S'inscrire</Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-x-4">
           <UserMenu user={user} />
        </div>
      )}
    </div>
  );
};