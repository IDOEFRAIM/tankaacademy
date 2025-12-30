import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";

import { AuthService, LessonsService } from "@/services";
import { IconBadge } from "@/components/icon-badge";
import { LessonTitleForm } from "@/components/lessons/lesson-title-form";
import { LessonDescriptionForm } from "@/components/lessons/lesson-description-form";
import { LessonAccessForm } from "@/components/lessons/lesson-access-form";
import { LessonVideoForm } from "@/components/lessons/lesson-video-form";
import { LessonActions } from "@/components/lessons/lesson-actions";
import { LessonQuizForm } from "@/components/lessons/lesson-quiz-form";

const LessonIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string; lessonId: string }>
}) => {
  const { courseId, chapterId, lessonId } = await params;
  const user = await AuthService.requireInstructor();

  const lesson = await LessonsService.getLessonById(lessonId, chapterId);

  if (!lesson) {
    return redirect("/");
  }

  const requiredFields = [
    lesson.title,
    lesson.description,
    lesson.videoUrl,
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
            href={`/instructor/courses/${courseId}/chapters/${chapterId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la configuration du chapitre
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Création de la leçon
              </h1>
              <span className="text-sm text-slate-700">
                Complétez tous les champs {completionText}
              </span>
            </div>
            <LessonActions
              disabled={!isComplete}
              courseId={courseId}
              chapterId={chapterId}
              lessonId={lessonId}
              isPublished={lesson.status === "PUBLISHED"}
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
                Personnalisez votre leçon
              </h2>
            </div>
            <LessonTitleForm
              initialData={lesson}
              courseId={courseId}
              chapterId={chapterId}
              lessonId={lessonId}
            />
            <LessonDescriptionForm
              initialData={lesson}
              courseId={courseId}
              chapterId={chapterId}
              lessonId={lessonId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">
                Paramètres d'accès
              </h2>
            </div>
            <LessonAccessForm
              initialData={lesson}
              courseId={courseId}
              chapterId={chapterId}
              lessonId={lessonId}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={Video} />
            <h2 className="text-xl">
              Vidéo
            </h2>
          </div>
          <LessonVideoForm
            initialData={lesson}
            courseId={courseId}
            chapterId={chapterId}
            lessonId={lessonId}
          />
          <LessonQuizForm
            initialData={lesson}
            courseId={courseId}
            chapterId={chapterId}
            lessonId={lessonId}
          />
        </div>
      </div>
    </div>
  );
}

export default LessonIdPage;
