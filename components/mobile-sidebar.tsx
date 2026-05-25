"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { InstructorSidebar } from "@/app/instructor/_components/sidebar";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  user?: {
    name?: string | null;
    image?: string | null;
    role?: UserRole;
  };
}

export const MobileSidebar = ({ open, onClose, user }: MobileSidebarProps) => {
  const pathname = usePathname();
  const isInstructorPage = pathname?.startsWith("/instructor");

  return (
    <Sheet open={open} onOpenChange={val => !val && onClose()}>
      {/* Le bouton hamburger est dans la navbar, donc pas ici */}
      <SheetContent side="left" className="p-0 bg-white">
        <SheetTitle className="hidden">Menu de navigation</SheetTitle>
        {/* Profil utilisateur */}
        <div className="p-4 border-b">
          {user?.image ? (
            <img src={user.image} alt={user.name ?? "Profil"} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
              {user?.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div className="mt-2 font-bold">{user?.name ?? "Profil"}</div>
          <div className="text-xs text-gray-500">{user?.role ?? ""}</div>
        </div>
        {isInstructorPage ? (
          <InstructorSidebar />
        ) : (
          <DashboardSidebar />
        )}
      </SheetContent>
    </Sheet>
  );
};