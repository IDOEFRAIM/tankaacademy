"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { InstructorSidebar } from "@/app/instructor/_components/sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isInstructorPage = pathname?.startsWith("/instructor");

  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <SheetTitle className="hidden">Menu de navigation</SheetTitle>
        {isInstructorPage ? (
          <InstructorSidebar />
        ) : (
          <DashboardSidebar />
        )}
      </SheetContent>
    </Sheet>
  )
}
