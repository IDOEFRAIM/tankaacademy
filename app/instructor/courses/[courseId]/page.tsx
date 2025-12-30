import { redirect } from "next/navigation";
import { LayoutDashboard, ListChecks, CircleDollarSign, File, AlertTriangle } from "lucide-react";

import { AuthService, CoursesService } from "@/services";
import { prisma } from "@/lib/prisma";
import { TitleForm } from "@/components/courses/title-form";
import { DescriptionForm } from "@/components/courses/description-form";
import { ImageForm } from "@/components/courses/image-form";
import { CategoryForm } from "@/components/courses/category-form";
import { PriceForm } from "@/components/courses/price-form";
import { ChaptersForm } from "@/components/courses/chapters-form";
import { CourseActions } from "@/components/courses/course-actions";
import { AttachmentForm } from "@/components/courses/attachment-form";

const CourseIdPage = async (props: { params: Promise<{ courseId: string }> }) => {
  const params = await props.params;
  const user = await AuthService.getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  // Utilisation du service dédié au dashboard
  const course = await CoursesService.getCourseDashboard(params.courseId, user.id);

  if (!course) {
    return redirect("/");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    { label: "Titre", isValid: !!course.title },
    { label: "Description", isValid: !!course.description },
    { label: "Image", isValid: !!course.image },
    { label: "Prix", isValid: course.price !== null },
    { label: "Catégorie", isValid: !!course.categoryId },
    { label: "Chapitres (min. 1 publié)", isValid: course.chapters.some(chapter => chapter.status === "PUBLISHED") },
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(field => field.isValid).length;

  const isComplete = requiredFields.every(field => field.isValid);
  const missingFields = requiredFields.filter(field => !field.isValid).map(field => field.label);

  const completionText = `(${completedFields}/${totalFields})`;

  return ( 
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Configuration du cours
          </h1>
          <span className="text-sm text-slate-700">
            Complétez tous les champs {completionText}
          </span>
          {!isComplete && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200 mt-2">
              <div className="flex items-center gap-x-2 font-medium mb-1">
                <AlertTriangle className="h-4 w-4" />
                Champs manquants :
              </div>
              <ul className="list-disc list-inside pl-1">
                {missingFields.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <CourseActions
          disabled={!isComplete}
          courseId={course.id}
          isPublished={course.status === "PUBLISHED"}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <div className="p-2 w-fit rounded-md bg-sky-100 text-sky-700">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-medium">
              Personnalisez votre cours
            </h2>
          </div>
          <TitleForm
            initialData={course}
            courseId={course.id}
          />
          <DescriptionForm
            initialData={course}
            courseId={course.id}
          />
          <ImageForm
            initialData={course}
            courseId={course.id}
          />
          <CategoryForm
            initialData={course}
            courseId={course.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 w-fit rounded-md bg-sky-100 text-sky-700">
                <ListChecks className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-medium">
                Chapitres du cours
              </h2>
            </div>
            <ChaptersForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 w-fit rounded-md bg-sky-100 text-sky-700">
                <CircleDollarSign className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-medium">
                Vendez votre cours
              </h2>
            </div>
            <PriceForm
              initialData={course}
              courseId={course.id}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <div className="p-2 w-fit rounded-md bg-sky-100 text-sky-700">
                <File className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-medium">
                Ressources & Pièces jointes
              </h2>
            </div>
            <AttachmentForm
              initialData={course}
              courseId={course.id}
            />
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default CourseIdPage;
