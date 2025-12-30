import { prisma } from "@/lib/prisma";
import { Course, Category, Chapter, Lesson } from "@prisma/client";
import { ProgressService } from "./progress";

export type CourseWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

export type CourseWithStats = Course & {
  category: Category | null;
  chapters: Chapter[];
  purchases: { id: string }[];
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: {
  userId: string;
  title?: string;
  categoryId?: string;
}): Promise<CourseWithCategory[]> => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        status: "PUBLISHED",
        title: {
          contains: title,
          mode: "insensitive",
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: { status: "PUBLISHED" },
          select: { id: true },
        },
        purchases: {
          where: { userId },
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const coursesWithProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          }
        }

        const progressPercentage = await ProgressService.getCourseProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}

export const CoursesService = {
  async getPublishedCourses({
    title,
    categoryId,
  }: {
    title?: string;
    categoryId?: string;
  }): Promise<CourseWithCategory[]> {
    try {
      const courses = await prisma.course.findMany({
        where: {
          status: "PUBLISHED",
          title: {
            contains: title,
            mode: "insensitive",
          },
          categoryId,
        },
        include: {
          category: true,
          chapters: {
            where: { status: "PUBLISHED" },
            select: { id: true },
          },
          purchases: {
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return courses.map((course) => ({
        ...course,
        progress: null,
      }));
    } catch (error) {
      console.error("[GET_PUBLISHED_COURSES]", error);
      return [];
    }
  },

  async getCourseById(courseId: string, userId: string = "") {
    try {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
          category: true,
          chapters: {
            where: { status: "PUBLISHED" },
            orderBy: { position: "asc" },
            include: {
              lessons: {
                where: { status: "PUBLISHED" },
                orderBy: { position: "asc" },
                include: {
                  userProgress: {
                    where: {
                      userId,
                    }
                  },
                  attachments: true,
                  quiz: {
                    include: {
                      questions: {
                        orderBy: { position: "asc" },
                        include: {
                          options: true,
                        }
                      }
                    }
                  }
                }
              },
            },
          },
          attachments: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return course;
    } catch (error) {
      console.error("[GET_COURSE_BY_ID]", error);
      return null;
    }
  },

  async getCourseDashboard(courseId: string, instructorId: string) {
    try {
      const course = await prisma.course.findUnique({
        where: {
          id: courseId,
          instructorId,
        },
        include: {
          category: true,
          chapters: {
            orderBy: { position: "asc" },
            include: {
              lessons: {
                orderBy: { position: "asc" },
              }
            }
          },
          attachments: {
            orderBy: { createdAt: "desc" },
            include: {
              lessons: true,
            }
          },
        },
      });

      return course;
    } catch (error) {
      console.error("[GET_COURSE_DASHBOARD]", error);
      return null;
    }
  },

  async getCoursesByInstructor(instructorId: string): Promise<CourseWithStats[]> {
    try {
      const courses = await prisma.course.findMany({
        where: {
          instructorId,
        },
        include: {
          category: true,
          chapters: {
            orderBy: { position: "asc" },
          },
          purchases: {
            select: { id: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return courses;
    } catch (error) {
      console.error("[GET_INSTRUCTOR_COURSES]", error);
      return [];
    }
  },

  async createCourse(instructorId: string, title: string) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const course = await prisma.course.create({
        data: {
          instructorId,
          title,
          slug: `${slug}-${Date.now()}`,
        },
      });

      return course;
    } catch (error) {
      console.error("[CREATE_COURSE]", error);
      throw error;
    }
  },

  async updateCourse(courseId: string, instructorId: string, values: Partial<Course>) {
    try {
      const course = await prisma.course.update({
        where: {
          id: courseId,
          instructorId,
        },
        data: {
          ...values,
        },
      });

      return course;
    } catch (error) {
      console.error("[UPDATE_COURSE]", error);
      throw error;
    }
  },

  async deleteCourse(courseId: string, instructorId: string) {
    try {
      const course = await prisma.course.delete({
        where: {
          id: courseId,
          instructorId,
        },
      });
      return course;
    } catch (error) {
      console.error("[DELETE_COURSE_SERVICE]", error);
      throw error;
    }
  },

  async publishCourse(courseId: string, instructorId: string) {
    try {
      const course = await prisma.course.update({
        where: {
          id: courseId,
          instructorId,
        },
        data: {
          status: "PUBLISHED",
        },
      });
      return course;
    } catch (error) {
      console.error("[PUBLISH_COURSE_SERVICE]", error);
      throw error;
    }
  },

  async unpublishCourse(courseId: string, instructorId: string) {
    try {
      const course = await prisma.course.update({
        where: {
          id: courseId,
          instructorId,
        },
        data: {
          status: "DRAFT",
        },
      });
      return course;
    } catch (error) {
      console.error("[UNPUBLISH_COURSE_SERVICE]", error);
      throw error;
    }
  },
};
