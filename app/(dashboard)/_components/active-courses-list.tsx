"use client";

import { Category, Chapter, Course } from "@prisma/client";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
};

interface ActiveCoursesListProps {
  courses: CourseWithProgressWithCategory[];
}

export const ActiveCoursesList = ({ courses }: ActiveCoursesListProps) => {
  if (courses.length === 0) {
    return (
       <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-300 rounded-xl">
           <BookOpen className="h-10 w-10 text-slate-300 mb-2" />
           <p className="text-slate-500 font-medium">Aucun cours actif</p>
           <Link href="/search" className="text-sky-600 hover:underline text-sm mt-1">
              Explorer le catalogue
           </Link>
       </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* "New Course" Card Style - acts as a CTA */}
      <div className="bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl p-6 flex flex-col justify-between items-start min-h-[200px] border border-orange-200/50">
         <div>
            <div className="flex -space-x-2 mb-4">
               {/* Avatars placeholder */}
               <div className="h-8 w-8 rounded-full bg-slate-300 border-2 border-white" />
               <div className="h-8 w-8 rounded-full bg-slate-400 border-2 border-white" />
               <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] text-slate-500 font-bold">
                 +12
               </div>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-1">Rejoindre un cours</h3>
            <p className="text-sm text-slate-500 leading-tight">
               Utilisez un code ou explorez le catalogue.
            </p>
         </div>
         <div className="w-full mt-4 bg-white p-1 rounded-lg flex items-center border shadow-sm">
             <input className="text-xs w-full px-2 outline-none bg-transparent" placeholder="Code cours..." disabled />
             <Link href="/search" className="bg-orange-400 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-sm hover:bg-orange-500 transition">
                Explorer
             </Link>
         </div>
      </div>

      {courses.map((course) => (
        <Link 
          href={`/courses/${course.id}`} 
          key={course.id}
          className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all group flex flex-col"
        >
           <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
                  <PlayCircle className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                 {course.chapters.length} Leçons
              </span>
           </div>
           
           <h3 className="font-bold text-slate-800 line-clamp-1 mb-1 group-hover:text-sky-700 transition-colors">
             {course.title}
           </h3>
           <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-[32px]">
             {course.category?.name || "Général"}
           </p>

           <div className="mt-auto">
              <div className="flex justify-between items-center text-xs text-slate-500 mb-1.5 font-medium">
                  <span>Progression</span>
                  <span>{Math.round(course.progress || 0)}%</span>
              </div>
              <Progress 
                value={course.progress || 0} 
                className="h-2 bg-slate-100" 
                // indicatorClassName="bg-sky-500" 
              />
              <div className="mt-4 flex items-center text-xs font-medium text-sky-600 gap-1 group-hover:underline">
                  Continuer <ArrowRight className="h-3 w-3" />
              </div>
           </div>
        </Link>
      ))}
    </div>
  );
};
