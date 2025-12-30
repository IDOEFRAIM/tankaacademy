import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AuthService, CoursesService } from "@/services";

const CoursesPage = async () => {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const courses = await CoursesService.getCoursesByInstructor(user.id);

  return ( 
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mes Cours</h1>
        <Link href="/instructor/create">
          <Button>
            Nouveau Cours
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Link key={course.id} href={`/instructor/courses/${course.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer bg-white">
              <h2 className="font-semibold text-lg">{course.title}</h2>
              <p className="text-sm text-slate-500 mt-2">
                {course.status === "PUBLISHED" ? "Publié" : "Brouillon"}
              </p>
              <div className="mt-4 text-xs text-slate-400">
                {course.category?.name || "Sans catégorie"}
              </div>
            </div>
          </Link>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full text-center text-slate-500 mt-10">
            Aucun cours trouvé. Créez votre premier cours !
          </div>
        )}
      </div>
    </div>
   );
}
 
export default CoursesPage;
