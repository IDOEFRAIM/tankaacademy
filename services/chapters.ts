import { prisma } from "@/lib/prisma";
import { Chapter } from "@prisma/client";

export const ChaptersService = {
  async createChapter(courseId: string, title: string) {
    try {
      // Trouver la dernière position
      const lastChapter = await prisma.chapter.findFirst({
        where: { courseId },
        orderBy: { position: "desc" },
      });

      const newPosition = lastChapter ? lastChapter.position + 1 : 1;

      const chapter = await prisma.chapter.create({
        data: {
          title,
          courseId,
          position: newPosition,
        },
      });

      return chapter;
    } catch (error) {
      console.error("[CREATE_CHAPTER_SERVICE]", error);
      throw error;
    }
  },

  async reorderChapters(courseId: string, updateData: { id: string; position: number }[]) {
    try {
      for (const item of updateData) {
        await prisma.chapter.update({
          where: { id: item.id },
          data: { position: item.position },
        });
      }
    } catch (error) {
      console.error("[REORDER_CHAPTERS_SERVICE]", error);
      throw error;
    }
  },

  async getChapterById(chapterId: string, courseId: string) {
    try {
      const chapter = await prisma.chapter.findUnique({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        include: {
          lessons: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      return chapter;
    } catch (error) {
      console.error("[GET_CHAPTER_BY_ID_SERVICE]", error);
      return null;
    }
  },

  async updateChapter(chapterId: string, courseId: string, values: Partial<Chapter>) {
    try {
      const chapter = await prisma.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          ...values,
        },
      });

      return chapter;
    } catch (error) {
      console.error("[UPDATE_CHAPTER_SERVICE]", error);
      throw error;
    }
  },

  async deleteChapter(chapterId: string, courseId: string) {
    try {
      const chapter = await prisma.chapter.delete({
        where: {
          id: chapterId,
          courseId: courseId,
        },
      });

      return chapter;
    } catch (error) {
      console.error("[DELETE_CHAPTER_SERVICE]", error);
      throw error;
    }
  },

  async publishChapter(chapterId: string, courseId: string) {
    try {
      const chapter = await prisma.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          status: "PUBLISHED",
        },
      });

      return chapter;
    } catch (error) {
      console.error("[PUBLISH_CHAPTER_SERVICE]", error);
      throw error;
    }
  },

  async unpublishChapter(chapterId: string, courseId: string) {
    try {
      const chapter = await prisma.chapter.update({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        data: {
          status: "DRAFT",
        },
      });

      return chapter;
    } catch (error) {
      console.error("[UNPUBLISH_CHAPTER_SERVICE]", error);
      throw error;
    }
  }
};
