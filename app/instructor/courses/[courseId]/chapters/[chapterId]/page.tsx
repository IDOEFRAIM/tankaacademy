import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { AuthService, ChaptersService } from "@/services";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "@/components/chapters/chapter-title-form";
import { ChapterDescriptionForm } from "@/components/chapters/chapter-description-form";
import { LessonsForm } from "@/components/chapters/lessons-form";
import { ChapterActions } from "@/components/chapters/chapter-actions";

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { courseId, chapterId } = await params;
  const user = await AuthService.requireInstructor();

  const chapter = await ChaptersService.getChapterById(chapterId, courseId);

  if (!chapter) {
    return redirect("/");
  }

  const requiredFields = [
    chapter.title,
    chapter.description,
    // chapter.videoUrl, // Chapter doesn't have videoUrl, Lessons do.
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/instructor/courses/${courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la configuration du cours
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Création du chapitre
              </h1>
              <span className="text-sm text-slate-700">
                Complétez tous les champs {completionText}
              </span>
            </div>
            <ChapterActions
              disabled={!isComplete}
              courseId={courseId}
              chapterId={chapterId}
              isPublished={chapter.status === "PUBLISHED"}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">
                Personnalisez votre chapitre
              </h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">
                Paramètres d'accès
              </h2>
            </div>
            {/* Access Settings Form (if needed, or maybe just info) */}
            <div className="mt-6 border bg-slate-100 rounded-md p-4">
                <p className="text-sm text-slate-500 italic">
                    Les paramètres d'accès (Gratuit/Payant) se configurent au niveau des leçons.
                </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">
              Leçons
            </h2>
          </div>
          <LessonsForm
            initialData={chapter}
            courseId={courseId}
            chapterId={chapterId}
          />
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;
