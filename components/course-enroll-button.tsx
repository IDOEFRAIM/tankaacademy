"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { checkout } from "@/actions/checkout";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  currency: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
  currency
}: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClick = async () => {
    try {
      setIsLoading(true);
      
      const response = await checkout(courseId);
      
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Inscription réussie !");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size="sm"
      className="w-full md:w-auto"
    >
      S&apos;inscrire pour {formatPrice(price, currency)}
    </Button>
  )
}
