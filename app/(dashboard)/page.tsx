import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CheckCircle, Clock } from "lucide-react";
import { InfoCard } from "./_components/info-card";
import { UserGreeting } from "./_components/user-greeting";
import { ActivityChart } from "./_components/activity-chart";
import { ActiveCoursesList } from "./_components/active-courses-list";
import { RightSidebar } from "./_components/right-sidebar";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/auth/login");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

  return (
    <div className="flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-full">
        <UserGreeting user={session?.user} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <InfoCard
              icon={Clock}
              label="En Cours"
              numberOfItems={coursesInProgress.length}
              variant="default"
           />
           <InfoCard
              icon={CheckCircle}
              label="Terminés"
              numberOfItems={completedCourses.length}
              variant="success"
           />
           <InfoCard
              icon={CheckCircle}
              label="Total Quiz"
              numberOfItems={8} // Placeholder
              variant="purple"
              subtitle="Quiz Complétés"
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {/* Chart Section */}
           <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-semibold text-slate-800">Temps d'apprentissage</h3>
                 <span className="text-xs text-orange-500 font-medium px-2 py-1 bg-orange-50 rounded-full">
                    Focus Mode
                 </span>
              </div>
              <ActivityChart /> 
           </div>

           {/* Assignments / Tasks Placeholder */}
           <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
              <div className="p-4 bg-sky-50 rounded-full">
                <Clock className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Prochains Devoirs</h3>
                <p className="text-sm text-slate-500 max-w-[200px]">
                  Vous êtes à jour ! Aucun devoir en attente pour le moment.
                </p>
              </div>
           </div>
        </div>

        {/* Active Courses Section */}
        <div>
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-slate-800">Vos cours actifs</h2>
             <span className="text-sm text-sky-700 font-medium cursor-pointer hover:underline">
               Voir tout
             </span>
           </div>
           <ActiveCoursesList courses={coursesInProgress} />
        </div>
      </div>
      
      {/* Right Sidebar */}
      <div className="w-[300px] border-l bg-white hidden xl:block p-6">
         <RightSidebar user={session?.user} />
      </div>

    </div>
  );
}
