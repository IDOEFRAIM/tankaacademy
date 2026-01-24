"use client";

import { User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RightSidebarProps {
  user?: User;
}

export const RightSidebar = ({ user }: RightSidebarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const todos = [
     { id: 1, text: "Finir le module Python", done: false },
     { id: 2, text: "Quiz sur les boucles", done: true },
     { id: 3, text: "Préparer le projet final", done: false },
  ];

  return (
    <div className="space-y-8">
       {/* Mini Profile */}
       <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-3 border-4 border-slate-50">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback className="bg-sky-700 text-white text-xl">
                {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-bold text-lg text-slate-800">{user?.name}</h2>
          <p className="text-slate-500 text-sm">@{user?.name?.toLowerCase().replace(" ", "")}</p>
          
          <Button variant="outline" size="sm" className="mt-4 rounded-full px-6 w-full max-w-[150px]">
             Mon Profil
          </Button>

          <div className="grid grid-cols-2 gap-4 w-full mt-6 text-center">
             <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-xl font-bold text-slate-800">12</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Cours</p>
             </div>
             <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-xl font-bold text-slate-800">4.8</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Moyenne</p>
             </div>
          </div>
       </div>

       {/* Calendar */}
       <div>
         <h3 className="font-bold text-slate-800 mb-4">Calendrier</h3>
         <div className="border rounded-xl p-3 shadow-sm bg-white">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none w-full"
            />
         </div>
       </div>

       {/* Upcoming Class / Todos */}
       <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-slate-800">To Do List</h3>
             <span className="text-xs text-sky-600 cursor-pointer">Voir tout</span>
          </div>
          <div className="space-y-3">
             {todos.map(todo => (
                 <div key={todo.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     {todo.done ? (
                         <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                     ) : (
                         <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                     )}
                     <span className={cn("text-sm font-medium", todo.done ? "text-slate-400 line-through" : "text-slate-700")}>
                        {todo.text}
                     </span>
                 </div>
             ))}
          </div>
       </div>

       {/* Pro Certification Promo */}
       <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 h-20 w-20 bg-white opacity-10 rounded-full blur-xl -mr-10 -mt-10" />
           <div className="relative z-10">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                 <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-bold text-lg mb-1">Certification Pro !</h3>
              <p className="text-white/80 text-xs mb-4">
                 Obtenez une certification vérifiée.
              </p>
              <Button size="sm" className="bg-white text-indigo-600 hover:bg-white/90 w-full rounded-full font-bold">
                 En savoir plus
              </Button>
           </div>
       </div> 
    </div>
  );
};

// Utility import for cn in component logic if needed, though strictly used in map here.
import { cn } from "@/lib/utils";
