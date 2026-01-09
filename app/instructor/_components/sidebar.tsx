"use client";

import { BarChart, LayoutDashboard, List } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  {
    icon: LayoutDashboard,
    label: "Tableau de bord",
    href: "/instructor",
  },
  {
    icon: List,
    label: "Mes Cours",
    href: "/instructor/courses",
  },
  {
    icon: BarChart,
    label: "Performances",
    href: "/instructor/analytics",
  },
];

export const InstructorSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => {
        // Strict check for the root instructor path to avoid highlighting it for sub-paths
        const isActive = route.href === "/instructor" 
          ? pathname === "/instructor"
          : pathname?.startsWith(route.href);

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
              isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
            )}
          >
            <div className="flex items-center gap-x-2 py-4">
              <route.icon size={22} className={cn("text-slate-500", isActive && "text-sky-700")} />
              {route.label}
            </div>
            <div
              className={cn(
                "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
                isActive && "opacity-100"
              )}
            />
          </Link>
        );
      })}
    </div>
  )
}
