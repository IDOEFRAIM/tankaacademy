import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { File, MessageSquare, BookOpen, Download, Share2, ThumbsUp, ChevronRight } from "lucide-react";

import { CoursesService } from "@/services/courses";
import { PurchaseService } from "@/services/purchase";
import { db } from "@/lib/db";
import { Separator } from "@/components/ui/separator";
import { VideoPlayer } from "@/components/video-player";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { CourseProgressButton } from "@/components/course-progress-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Preview } from "@/components/preview";

import { CommentForm } from "@/components/comments/comment-form";
import { CommentList } from "@/components/comments/comment-list";
import { VideoWrapper } from "@/components/video-wrapper";
import { LikeButton } from "@/components/like-button";
import { ShareButton } from "@/components/share-button";
import { QuizModal } from "@/components/quiz/quiz-modal";

export default async function LessonIdPage({
  params
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId, lessonId } = await params;

  const course = await CoursesService.getCourseById(courseId, userId);

  if (!course) {
    return redirect("/");
  }

  const lesson = course.chapters.flatMap(c => c.lessons).find(l => l.id === lessonId);

  if (!lesson) {
    return redirect(`/courses/${courseId}`);
  }

  // Fetch attachments linked to this lesson
  const lessonAttachments = await db.attachment.findMany({
    where: {
      lessons: {
        some: {
          id: lessonId
        }
      }
    }
  });

  const userProgress = lesson.userProgress?.[0];
  
  const hasAccess = await PurchaseService.checkCourseAccess(userId, courseId);

  const comments = await db.comment.findMany({
    where: {
      lessonId: lessonId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const likesCount = await db.lessonLike.count({
    where: {
      lessonId: lessonId,
    }
  });

  const isLikedByUser = userId ? await db.lessonLike.findUnique({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      }
    }
  }) : null;

  const isLocked = !lesson.isFree && !hasAccess;
  const completeOnEnd = !!hasAccess && !userProgress?.isCompleted;

  // Find next lesson
  const allLessons = course.chapters.flatMap(c => c.lessons);
  const lessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = allLessons[lessonIndex + 1];
  const nextLessonId = nextLesson?.id;

  const currentUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://tankaacademy.com"}/courses/${courseId}/lessons/${lessonId}`;

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="flex flex-col max-w-7xl mx-auto">
        {/* Video Section - Full Width / Theater Mode capable */}
        <div className="w-full bg-black shadow-xl">
          <div className="max-w-7xl mx-auto">
            {lesson.videoUrl && (
              <VideoWrapper>
                <VideoPlayer
                  lessonId={lessonId}
                  title={lesson.title}
                  courseId={courseId}
                  nextLessonId={nextLessonId}
                  videoUrl={lesson.videoUrl}
                  isLocked={isLocked}
                  completeOnEnd={completeOnEnd}
                  className="h-full w-full"
                />
              </VideoWrapper>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">
                      {lesson.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Chapitre {course.chapters.find(c => c.id === lesson.chapterId)?.position}
                      </Badge>
                      <span>•</span>
                      <span>Leçon {lesson.position}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {hasAccess ? (
                      <CourseProgressButton
                        lessonId={lessonId}
                        courseId={courseId}
                        nextLessonId={nextLessonId}
                        isCompleted={!!userProgress?.isCompleted}
                      />
                    ) : (
                      <CourseEnrollButton
                        courseId={courseId}
                        price={course.price!}
                        currency={course.currency}
                      />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <LikeButton
                    lessonId={lessonId}
                    courseId={courseId}
                    isLiked={!!isLikedByUser}
                    likeCount={likesCount}
                  />
                  <ShareButton
                    url={currentUrl}
                    title={lesson.title}
                  />
                </div>
              </div>
            </div>

            {/* Tabs Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b px-6 pt-2">
                  <TabsList className="bg-transparent h-12 p-0 space-x-6">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-600 rounded-none px-0 pb-2 text-slate-500 data-[state=active]:text-sky-700"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Aperçu
                    </TabsTrigger>
                    <TabsTrigger 
                      value="comments" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-600 rounded-none px-0 pb-2 text-slate-500 data-[state=active]:text-sky-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discussion ({comments.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="resources" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-600 rounded-none px-0 pb-2 text-slate-500 data-[state=active]:text-sky-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Ressources ({lessonAttachments.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6">
                  <TabsContent value="overview" className="mt-0 space-y-4">
                    <div className="prose max-w-none text-slate-700">
                      <h3 className="text-lg font-semibold mb-4">À propos de cette leçon</h3>
                      <Preview value={lesson.description || "Aucune description disponible."} />
                    </div>
                    {/* @ts-ignore */}
                    {lesson.quiz && (
                      /* @ts-ignore */
                      <QuizModal quiz={lesson.quiz} />
                    )}
                  </TabsContent>

                  <TabsContent value="comments" className="mt-0">
                    <div className="space-y-6">
                      {hasAccess ? (
                        <CommentForm lessonId={lessonId} />
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-lg text-center text-slate-500 text-sm">
                          Vous devez être inscrit pour participer à la discussion.
                        </div>
                      )}
                      <CommentList items={comments} currentUserId={userId} />
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0">
                    {lessonAttachments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lessonAttachments.map((attachment) => (
                          <a 
                            href={attachment.url} 
                            target="_blank" 
                            key={attachment.id}
                            className="flex items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-sky-50 hover:border-sky-200 transition-all group"
                          >
                            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center mr-4 group-hover:bg-sky-200 transition-colors">
                              <File className="h-5 w-5 text-sky-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 line-clamp-1">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                Cliquez pour télécharger
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        <File className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Aucune ressource disponible pour cette leçon.</p>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Sidebar Column (Desktop) - Could be used for related content, notes, or just spacing */}
          <div className="hidden lg:block space-y-6">
            {/* Instructor Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Instructeur</h3>
              <div className="flex items-center gap-3">
                {/* Assuming we have instructor data, if not we might need to fetch it or pass it down */}
                <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden">
                  {/* Placeholder for avatar */}
                </div>
                <div>
                  <p className="font-medium text-sm">Tanka Academy</p>
                  <p className="text-xs text-slate-500">Expert IA & Tech</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-4">
                Apprenez avec les meilleurs experts du domaine.
              </p>
            </div>

            {/* Next Lesson Preview */}
            {nextLesson && (
              <div className="bg-gradient-to-br from-sky-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <p className="text-xs font-medium text-sky-300 uppercase tracking-wider mb-2">
                  À suivre
                </p>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {nextLesson.title}
                </h3>
                <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                  Continuez votre progression vers la maîtrise.
                </p>
                <Button variant="secondary" className="w-full bg-white/10 hover:bg-white/20 text-white border-0" asChild>
                  <a href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    Continuer <ChevronRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
