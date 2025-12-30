"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

interface CertificateActionsProps {
  courseId: string;
}

export const CertificateActions = ({ courseId }: CertificateActionsProps) => {
  return (
    <div className="mb-8 print:hidden flex items-center gap-x-4">
      <Button asChild variant="outline">
        <Link href={`/courses/${courseId}`}>
          Retour au cours
        </Link>
      </Button>
      <Button onClick={() => window.print()}>
        <Download className="h-4 w-4 mr-2" />
        Imprimer / PDF
      </Button>
    </div>
  );
};
