"use client";

import { User } from "next-auth";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserGreetingProps {
  user?: User;
}

export const UserGreeting = ({ user }: UserGreetingProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Bonjour, {user?.name?.split(" ")[0] || "Étudiant"} 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Prêt à apprendre quelque chose de nouveau aujourd'hui ?
        </p>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="relative hidden md:block">
           <Search className="h-4 w-4 absolute top-3 left-3 text-slate-400" />
           <Input 
             className="pl-9 w-[300px] bg-white rounded-full border-slate-200 focus-visible:ring-sky-200"
             placeholder="Rechercher un cours..."
           />
        </div>
        <div className="p-2.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <div className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
};
