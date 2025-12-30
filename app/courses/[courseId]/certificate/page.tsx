import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CertificateService } from "@/services/certificate";
import { CertificateActions } from "@/components/certificate-actions";

export default async function CertificatePage({
  params
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const data = await CertificateService.getCertificateData(userId, courseId);

  if (!data) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
      <CertificateActions courseId={courseId} />

      <div className="bg-white p-12 md:p-20 shadow-lg text-center max-w-4xl w-full border-8 border-double border-slate-200 print:shadow-none print:border-4">
        <div className="mb-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-800 mb-4">
            Certificat de Réussite
          </h1>
          <p className="text-xl text-slate-500 italic">
            Ce certificat est fièrement décerné à
          </p>
        </div>

        <div className="mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-sky-700 mb-4 font-serif">
            {data.studentName}
          </h2>
          <div className="h-1 w-32 bg-sky-700 mx-auto rounded-full" />
        </div>

        <div className="mb-12">
          <p className="text-xl text-slate-600 mb-2">
            Pour avoir complété avec succès le cours
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            {data.courseTitle}
          </h3>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mt-20 px-10">
          <div className="text-center mb-8 md:mb-0">
            <div className="border-t-2 border-slate-400 w-48 mx-auto pt-2">
              <p className="font-bold text-slate-700">{data.completionDate.toLocaleDateString('fr-FR')}</p>
              <p className="text-sm text-slate-500">Date</p>
            </div>
          </div>

          <div className="mb-8 md:mb-0">
             {/* Logo Tanka Academy Placeholder */}
             <div className="h-24 w-24 bg-sky-700 rounded-full flex items-center justify-center text-white font-bold text-xs mx-auto">
                TANKA
                <br/>
                ACADEMY
             </div>
          </div>

          <div className="text-center">
            <div className="border-t-2 border-slate-400 w-48 mx-auto pt-2">
              <p className="font-bold text-slate-700">{data.instructorName}</p>
              <p className="text-sm text-slate-500">Instructeur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
