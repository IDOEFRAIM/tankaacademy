import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CoursesService } from "@/services/courses";
import { PurchaseService } from "@/services/purchase";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { File, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { ReviewList } from "@/components/review-list";
import { getReviews } from "@/actions/reviews";

export default async function CourseIdPage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId } = await params;

  const course = await CoursesService.getCourseById(courseId, userId);

  if (!course) {
    return redirect("/");
  }

  const hasAccess = await PurchaseService.checkCourseAccess(userId, courseId);

  const reviews = await getReviews(courseId);
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0;

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* HERO SECTION */}
      <div className="p-6 bg-slate-100 border-b">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {course.image && (
            <div className="relative w-full md:w-1/3 aspect-video rounded-md overflow-hidden border">
              <img 
                src={course.image} 
                alt={course.title} 
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-x-2 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-current mr-1" />
                <span className="font-medium text-slate-700">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span>•</span>
              <span>{reviews.length} avis</span>
              <span>•</span>
              <span>{course.chapters.length} chapitres</span>
            </div>
            
            <div className="flex gap-x-2">
              {hasAccess ? (
                <Link href={`/courses/${course.id}/lessons/${firstLesson?.id}`}>
                  <Button size="lg" className="w-full md:w-auto">
                    {firstLesson ? "Continuer la formation" : "Commencer"}
                  </Button>
                </Link>
              ) : (
                <CourseEnrollButton
                  courseId={course.id}
                  price={course.price!}
                  currency={course.currency}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: DESCRIPTION & REVIEWS */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">À propos de ce cours</h2>
            <div className="bg-white p-4 rounded-md border">
              <Preview value={course.description || "Aucune description."} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Avis des étudiants</h2>
            <ReviewList items={reviews} />
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCES & INSTRUCTOR */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Ressources du cours</h2>
            <div className="bg-white p-4 rounded-md border space-y-2">
              {course.attachments.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  Aucune ressource disponible pour ce cours.
                </p>
              )}
              {course.attachments.map((attachment) => (
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-50 border border-sky-100 text-sky-700 rounded-md hover:bg-sky-100 transition"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="line-clamp-1 text-sm font-medium">
                    {attachment.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
