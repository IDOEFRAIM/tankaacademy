import { prisma } from "@/lib/prisma";
import { Lesson } from "@prisma/client";

export const LessonsService = {
  async createLesson(chapterId: string, title: string) {
    try {
      const lastLesson = await prisma.lesson.findFirst({
        where: { chapterId },
        orderBy: { position: "desc" },
      });

      const newPosition = lastLesson ? lastLesson.position + 1 : 1;

      const lesson = await prisma.lesson.create({
        data: {
          title,
          chapterId,
          position: newPosition,
        },
      });

      return lesson;
    } catch (error) {
      console.error("[CREATE_LESSON_SERVICE]", error);
      throw error;
    }
  },

  async reorderLessons(chapterId: string, updateData: { id: string; position: number }[]) {
    try {
      for (const item of updateData) {
        await prisma.lesson.update({
          where: { id: item.id },
          data: { position: item.position },
        });
      }
    } catch (error) {
      console.error("[REORDER_LESSONS_SERVICE]", error);
      throw error;
    }
  },

  async updateLesson(lessonId: string, chapterId: string, values: Partial<Lesson>) {
    try {
      const lesson = await prisma.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          ...values,
        },
      });
      return lesson;
    } catch (error) {
      console.error("[UPDATE_LESSON_SERVICE]", error);
      throw error;
    }
  },

  async publishLesson(lessonId: string, chapterId: string) {
    try {
      const lesson = await prisma.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          status: "PUBLISHED",
        },
      });
      return lesson;
    } catch (error) {
      console.error("[PUBLISH_LESSON_SERVICE]", error);
      throw error;
    }
  },

  async unpublishLesson(lessonId: string, chapterId: string) {
    try {
      const lesson = await prisma.lesson.update({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
        data: {
          status: "DRAFT",
        },
      });
      return lesson;
    } catch (error) {
      console.error("[UNPUBLISH_LESSON_SERVICE]", error);
      throw error;
    }
  },

  async getLessonById(lessonId: string, chapterId: string) {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
        include: {
          quiz: {
            include: {
              questions: {
                orderBy: {
                  position: "asc",
                },
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });
      return lesson;
    } catch (error) {
      console.error("[GET_LESSON_BY_ID_SERVICE]", error);
      return null;
    }
  },

  async deleteLesson(lessonId: string, chapterId?: string) {
    try {
      const lesson = await prisma.lesson.delete({
        where: { id: lessonId },
      });
      return lesson;
    } catch (error) {
      console.error("[DELETE_LESSON_SERVICE]", error);
      throw error;
    }
  }
};
