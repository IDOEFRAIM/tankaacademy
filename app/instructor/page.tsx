import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, CreditCard, DollarSign } from "lucide-react";

import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { AuthService } from "@/services";
import { getAnalytics } from "@/actions/get-analytics";

import { DataCard } from "./analytics/_components/data-card";
import { Chart } from "./analytics/_components/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InstructorDashboardPage = async () => {
  const user = await AuthService.getCurrentUser();

  if (!user) {
    return redirect("/");
  }

  const {
    dataByDate,
    totalRevenue,
    totalSales,
  } = await getAnalytics(user.id);

  const recentCourses = await db.course.findMany({
    where: {
      instructorId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      _count: {
        select: {
          purchases: true,
          chapters: true,
        }
      }
    }
  });

  return ( 
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Tableau de bord formateur
        </h1>
        <Link href="/instructor/create">
          <Button>
            Nouveau cours
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Revenu Total"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Ventes Totales"
          value={totalSales}
        />
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cours Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentCourses.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="flex flex-col gap-4">
           <h2 className="text-xl font-semibold">Performances (Revenus / Temps)</h2>
           <Chart data={dataByDate} />
        </div>
        
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
             <h2 className="text-xl font-semibold">Cours Récents</h2>
             <Link href="/instructor/courses" className="text-sm text-blue-600 hover:underline">
               Tout voir
             </Link>
           </div>
           
           <div className="space-y-4">
             {recentCourses.length === 0 && (
               <div className="text-muted-foreground text-sm italic">
                  Aucun cours créé pour le moment.
               </div>
             )}
             {recentCourses.map((course) => (
                <div key={course.id} className="p-4 border rounded-md bg-white shadow-sm flex items-center justify-between group hover:shadow-md transition">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium truncate max-w-[200px] sm:max-w-md">
                      {course.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                       <Badge variant={course.isPublished ? "default" : "secondary"}>
                          {course.isPublished ? "Publié" : "Brouillon"}
                       </Badge>
                       <span>
                         {course.price ? formatPrice(course.price) : "Gratuit"}
                       </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-x-1">
                      <BookOpen className="h-4 w-4" />
                      {course._count.chapters} Chapitres
                    </div>
                    <div className="flex items-center gap-x-1">
                      <CreditCard className="h-4 w-4" />
                      {course._count.purchases} Ventes
                    </div>
                    <Link href={`/instructor/courses/${course.id}`}>
                       <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition">
                          Éditer <ArrowRight className="h-4 w-4 ml-2" />
                       </Button>
                    </Link>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
   );
}
 
export default InstructorDashboardPage;