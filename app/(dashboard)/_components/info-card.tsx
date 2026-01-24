import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success" | "purple";
  label: string;
  icon: LucideIcon;
  subtitle?: string;
}

export const InfoCard = ({
  variant = "default",
  icon: Icon,
  numberOfItems,
  label,
  subtitle
}: InfoCardProps) => {
  return (
    <div className="border rounded-2xl flex items-center p-6 bg-white shadow-sm hover:shadow-md transition">
      <div className={cn(
        "p-4 rounded-xl mr-4",
        variant === "default" && "bg-sky-100 text-sky-700",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        variant === "purple" && "bg-purple-100 text-purple-700",
      )}>
        <Icon size={24} />
      </div>
      <div>
        <p className="font-bold text-2xl text-slate-800">
          {numberOfItems}
        </p>
        <p className="font-medium text-slate-600 text-sm">
          {label}
        </p>
        {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
