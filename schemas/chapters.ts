import * as z from "zod";

export const CreateChapterSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
});

export const ChapterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export const UpdateChapterSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});
