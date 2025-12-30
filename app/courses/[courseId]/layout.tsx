import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CoursesService } from "@/services/courses";
import { ProgressService } from "@/services/progress";
import { PurchaseService } from "@/services/purchase";
import { CourseSidebar } from "@/components/course-sidebar";
import { CourseNavbar } from "@/components/course-navbar";

export default async function CourseLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId } = await params;

  const course = await CoursesService.getCourseById(courseId, userId);

  if (!course) {
    return redirect("/");
  }

  const progressCount = await ProgressService.getCourseProgress(userId || "", course.id);

  const hasAccess = await PurchaseService.checkCourseAccess(userId, courseId);

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
        <CourseNavbar
          course={course}
          progressCount={progressCount}
          isPurchased={hasAccess}
          user={session?.user}
        />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar
          course={course}
          progressCount={progressCount}
          isPurchased={hasAccess}
        />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">
        {children}
      </main>
    </div>
  )
}
