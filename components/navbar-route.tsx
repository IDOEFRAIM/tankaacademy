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
  const isPlayerPage = pathname?.includes("/courses") && !isInstructorPage;

  return (
    <div className="flex gap-x-2 ml-auto">
      {/* 1. Mode Player (Course View) */}
      {isPlayerPage ? (
        <Link href="/dashboard">
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Quitter le cours
          </Button>
        </Link>
      ) : (
        /* 2. Navigation Modes (Hub) */
        <div className="flex gap-x-2 items-center">
          
          {/* Show 'Mode Étudiant' if on Admin or Instructor pages */}
          {(isAdminPage || isInstructorPage) && (
            <Link href="/dashboard">
              <Button size="sm" variant="ghost">
                <LogOut className="h-4 w-4 mr-2" />
                Quitter le mode formateur
              </Button>
            </Link>
          )}

          {/* Show 'Mode Formateur' if Admin or Instructor, AND NOT on Instructor Page */}
          {user && (user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN) && !isInstructorPage && (
            <Link href="/instructor/courses">
              <Button size="sm" variant="ghost">
                Mode Formateur
              </Button>
            </Link>
          )}

          {/* Show 'Mode Admin' if Admin AND NOT on Admin Page */}
          {user && user.role === UserRole.ADMIN && !isAdminPage && (
            <Link href="/admin">
              <Button size="sm" variant="ghost">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Mode Admin
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* 3. AUTHENTIFICATION */}
      {!user ? (
        <div className="flex items-center gap-x-2 ml-4">
          <Link href="/auth/login">
            <Button size="sm" variant="ghost">Connexion</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">S'inscrire</Button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-x-4 ml-4">
           <UserMenu user={user} />
        </div>
      )}
    </div>
  );
};