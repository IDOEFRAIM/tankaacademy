"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isInstructorPage = pathname?.startsWith("/instructor");
  const isPlayerPage = pathname?.includes("/courses") && pathname?.split("/").length > 2 && !isInstructorPage;

  if (isPlayerPage) {
    return null;
  }

  return (
    <>
      <div className="h-20 fixed inset-y-0 w-full z-50 bg-white border-b shadow-sm">
        <div className="p-4 h-full flex items-center">
          {/* Bouton hamburger mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <svg width="24" height="24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2"/></svg>
          </button>
          {/* Sidebar mobile */}
          <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
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
      <div className="h-20" />
    </>
  );
};