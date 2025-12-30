"use client";

import { Chapter, Course, Lesson, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";
import { Award, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { CourseSidebarItem } from "./course-sidebar-item";
import { Button } from "@/components/ui/button";
// import { CourseProgress } from "@/components/course-progress";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
      })[]
    })[]
  };
  progressCount: number;
  isPurchased?: boolean;
};

export const CourseSidebar = ({
  course,
  progressCount,
  isPurchased = false,
}: CourseSidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <Link 
          href={`/courses/${course.id}`}
          className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Info cours
        </Link>
        <h1 className="font-semibold">
          {course.title}
        </h1>
        {/* TODO: Add CourseProgress component */}
        {isPurchased && (
          <div className="mt-10">
            <div className="font-medium text-sm text-slate-500 mb-2">
              Progression : {Math.round(progressCount)}%
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full">
              <div 
                className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                style={{ width: `${progressCount}%` }}
              />
            </div>
            {progressCount === 100 && (
              <div className="mt-6">
                <Button size="sm" variant="success" className="w-full" asChild>
                  <Link href={`/courses/${course.id}/certificate`}>
                    <Award className="h-4 w-4 mr-2" />
                    Certificat
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <div key={chapter.id}>
            <div className="px-6 py-4 font-medium text-sm bg-slate-50 border-b">
              {chapter.title}
            </div>
            <div className="flex flex-col w-full">
              {chapter.lessons.map((lesson) => (
                <CourseSidebarItem
                  key={lesson.id}
                  id={lesson.id}
                  label={lesson.title}
                  isCompleted={!!lesson.userProgress?.[0]?.isCompleted}
                  courseId={course.id}
                  isLocked={!lesson.isFree && !isPurchased}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
