import * as z from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
});

export const CourseSchema = z.object({
  title: z.string().min(1, {
    message: "Le titre est requis",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.coerce.number().optional(),
  currency: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.boolean().optional(),
});
