import { Prisma } from "@prisma/client";

// Ce type définit exactement ce qu'un "Cours avec ses relations" contient
export type CourseWithDashboardRelations = Prisma.CourseGetPayload<{
  include: {
    category: true;
    chapters: { select: { id: true } };
  };
}>;