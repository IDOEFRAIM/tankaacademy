"use client";

import { Menu } from "lucide-react";
import { Chapter, Course, Lesson, UserProgress } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";

import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
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

export const CourseMobileSidebar = ({
  course,
  progressCount,
  isPurchased,
}: CourseMobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <SheetTitle className="hidden">Menu du cours</SheetTitle>
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          isPurchased={isPurchased}
        />
      </SheetContent>
    </Sheet>
  )
}
