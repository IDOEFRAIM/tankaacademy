"use client";

import { Chapter, Course, Lesson, UserProgress } from "@prisma/client";
import { UserRole } from "@/types";

import { NavbarRoutes } from "@/components/navbar-route";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[] | null;
      })[]
    })[]
  };
  progressCount: number;
  isPurchased?: boolean;
  user?: {
    name?: string | null;
    image?: string | null;
    role?: UserRole;
  };
};

export const CourseNavbar = ({
  course,
  progressCount,
  isPurchased,
  user,
}: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
        isPurchased={isPurchased}
      />
      <NavbarRoutes user={user} />
    </div>
  )
}
