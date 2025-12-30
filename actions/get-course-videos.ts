"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export const getCourseVideos = async (courseId: string) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return [];
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
      include: {
        chapters: {
          include: {
            lessons: {
              where: {
                videoUrl: {
                  not: null,
                },
              },
              select: {
                id: true,
                title: true,
                videoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return [];
    }

    const videos = course.chapters.flatMap((chapter) => 
      chapter.lessons.map((lesson) => ({
        label: `Leçon : ${lesson.title}`,
        url: lesson.videoUrl!,
        id: lesson.id,
      }))
    );

    // Filter out duplicates by URL
    const uniqueVideos = Array.from(new Map(videos.map(item => [item.url, item])).values());

    return uniqueVideos;
  } catch (error) {
    console.log("[GET_COURSE_VIDEOS]", error);
    return [];
  }
};
