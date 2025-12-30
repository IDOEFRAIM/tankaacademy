"use client";

import { BarChart, List, Settings, Shield, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const routes = [
  {
    icon: BarChart,
    label: "Vue d'ensemble",
    href: "/admin",
  },
  {
    icon: List,
    label: "Catégories",
    href: "/admin/categories",
  },
  {
    icon: Users,
    label: "Utilisateurs",
    href: "/admin/users",
  },
  {
    icon: Settings,
    label: "Paramètres Système",
    href: "/admin/settings",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-x-2 px-6 py-4 mb-4">
         <Shield className="h-8 w-8 text-rose-600" />
         <span className="font-bold text-xl text-rose-600">Admin</span>
      </div>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            pathname === route.href && "text-rose-700 bg-rose-200/20 hover:bg-rose-200/20 hover:text-rose-700"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <route.icon size={22} className={cn("text-slate-500", pathname === route.href && "text-rose-700")} />
            {route.label}
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 border-2 border-rose-700 h-full transition-all",
              pathname === route.href && "opacity-100"
            )}
          />
        </Link>
      ))}
    </div>
  )
}
