import { redirect } from "next/navigation";
import { AuthService } from "@/services";
import { UserRole } from "@/types";
import { AdminSidebar } from "./_components/sidebar";

const AdminLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const user = await AuthService.getCurrentUser();

  if (!user || user.role !== UserRole.ADMIN) {
    return redirect("/");
  }

  return ( 
    <div className="h-full">
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50 mt-[80px] border-r bg-white">
        <AdminSidebar />
      </div>
      <main className="md:pl-56 h-full pt-6">
        {children}
      </main>
    </div>
   );
}
 
export default AdminLayout;
