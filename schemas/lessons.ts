import * as z from "zod";

export const CreateLessonSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
});

export const LessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export const UpdateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});
