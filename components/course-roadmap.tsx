"use client";

import { Chapter, Course, Lesson, UserProgress } from "@prisma/client";
import { CheckCircle, Lock, PlayCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CourseRoadmapProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
      })[]
    })[]
  };
  currentUserId?: string | null;
  isPurchased: boolean;
}

export const CourseRoadmap = ({
  course,
  isPurchased,
}: CourseRoadmapProps) => {
  return (
    <div className="relative pl-6 md:pl-0">
       <h2 className="text-xl font-semibold mb-6">Votre Parcours</h2>
       
       <div className="relative border-l-2 border-slate-200 ml-3 md:ml-6 space-y-12 pb-10">
          {course.chapters.map((chapter, chapterIndex) => (
             <div key={chapter.id} className="relative pl-8 md:pl-12">
                 {/* Chapter Node */}
                 <div className="absolute -left-[9px] top-0 h-5 w-5 rounded-full bg-slate-200 border-4 border-white ring-1 ring-slate-300 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                 </div>

                 <h3 className="font-semibold text-lg text-slate-800 mb-4 flex items-center">
                    <span className="text-slate-500 mr-2 text-sm font-normal uppercase tracking-wider">
                       Chapitre {chapterIndex + 1}
                    </span>
                    {chapter.title}
                 </h3>

                 <div className="grid gap-3">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = !!lesson.userProgress?.[0]?.isCompleted;
                        const isLocked = !lesson.isFree && !isPurchased; 
                        
                        return (
                            <Link 
                              key={lesson.id}
                              href={isLocked ? "#" : `/courses/${course.id}/lessons/${lesson.id}`}
                              className={cn(
                                "group relative flex items-center p-4 rounded-xl border transition-all duration-200",
                                isLocked 
                                  ? "bg-slate-50 border-slate-200 opacity-75 cursor-not-allowed" 
                                  : "bg-white border-slate-200 hover:border-sky-300 hover:shadow-md cursor-pointer",
                                isCompleted && "bg-emerald-50/50 border-emerald-200/60"
                              )}
                            >
                               <div className={cn(
                                  "mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors",
                                  isCompleted ? "bg-emerald-100 border-emerald-200 text-emerald-700" : 
                                  isLocked ? "bg-slate-100 border-slate-200 text-slate-400" :
                                  "bg-sky-100 border-sky-200 text-sky-700 group-hover:bg-sky-200"
                               )}>
                                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : 
                                   isLocked ? <Lock className="h-5 w-5" /> :
                                   <PlayCircle className="h-5 w-5" />}
                               </div>

                               <div className="flex-1">
                                  <div className="font-medium text-slate-900 group-hover:text-sky-800 transition">
                                    {lesson.title}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                     Leçon {chapterIndex + 1}.{lessonIndex + 1}
                                     {lesson.isFree && !isPurchased && (
                                       <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                                          Gratuit
                                       </span>
                                     )}
                                  </div>
                               </div>
                            </Link>
                        );
                    })}
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
};
