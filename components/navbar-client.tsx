"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserRole } from "@/types";
import { NavbarRoutes } from "./navbar-route";
import { MobileSidebar } from "./mobile-sidebar";

interface NavbarClientProps {
  user?: {
    name?: string | null;
    image?: string | null;
    role?: UserRole;
  };
}

export const NavbarClient = ({ user }: NavbarClientProps) => {
  const pathname = usePathname();

  // Hide navbar on course player pages
  // /courses is the list (keep navbar)
  // /courses/xyz is the player (hide navbar)
  const isPlayerPage = pathname?.includes("/courses") && pathname?.split("/").length > 2;

  if (isPlayerPage) {
    return null;
  }

  return (
    <>
      <div className="h-[80px] fixed inset-y-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="p-4 h-full flex items-center">
          <MobileSidebar />
          <div className="flex items-center justify-between w-full ml-4">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-x-2">
              <span className="text-2xl font-bold text-blue-600 tracking-tighter">
                TANKA<span className="text-slate-900">ACADEMY</span>
              </span>
            </Link>

            {/* ROUTES & AUTH */}
            <NavbarRoutes user={user} />
          </div>
        </div>
      </div>
      <div className="h-[80px]" />
    </>
  );
};
