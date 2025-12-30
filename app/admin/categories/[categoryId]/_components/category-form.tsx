"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Category } from "@prisma/client";
import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est requis",
  }),
});

interface CategoryFormProps {
  initialData?: Category;
}

export const CategoryForm = ({ initialData }: CategoryFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      if (initialData) {
        await axios.patch(`/api/admin/categories/${initialData.id}`, values);
        toast.success("Catégorie mise à jour");
      } else {
        await axios.post("/api/admin/categories", values);
        toast.success("Catégorie créée");
        router.push("/admin/categories");
      }
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    try {
      if (!initialData) return;
      setIsSubmitting(true);
      await axios.delete(`/api/admin/categories/${initialData.id}`);
      toast.success("Catégorie supprimée");
      router.push("/admin/categories");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = initialData ? "Éditer la catégorie" : "Nouvelle catégorie";

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {initialData && (
          <ConfirmModal onConfirm={onDelete}>
            <Button disabled={isSubmitting} variant="destructive" size="sm">
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        )}
      </div>
      <div className="bg-white p-6 rounded-md border shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la catégorie</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="Ex: Développement Web" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting} type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
