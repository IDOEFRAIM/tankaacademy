"use client";

import { Compass, Layout, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  {
    icon: Compass,
    label: "Catalogue",
    href: "/",
  },
  {
    icon: Layout,
    label: "Mon Apprentissage",
    href: "/dashboard",
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/settings",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            (pathname === route.href || (route.href !== "/" && pathname?.startsWith(route.href))) && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <route.icon size={22} className={cn("text-slate-500", (pathname === route.href || (route.href !== "/" && pathname?.startsWith(route.href))) && "text-sky-700")} />
            {route.label}
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
              (pathname === route.href || (route.href !== "/" && pathname?.startsWith(route.href))) && "opacity-100"
            )}
          />
        </Link>
      ))}
    </div>
  )
}
