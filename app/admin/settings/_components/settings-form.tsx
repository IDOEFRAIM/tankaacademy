"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  uploadLimit: z.string(),
});

interface SystemSettingsFormProps {
  initialLimit: string;
}

export const SystemSettingsForm = ({ initialLimit }: SystemSettingsFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadLimit: initialLimit,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch("/api/admin/settings", values);
      toast.success("Paramètres mis à jour");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded-md border shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="uploadLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Limite de taille d'upload (Vidéos)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une limite" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="104857600">100 Mo</SelectItem>
                    <SelectItem value="524288000">500 Mo</SelectItem>
                    <SelectItem value="1073741824">1 Go</SelectItem>
                    <SelectItem value="2147483648">2 Go</SelectItem>
                    <SelectItem value="5368709120">5 Go</SelectItem>
                    <SelectItem value="10737418240">10 Go</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Définit la taille maximale des fichiers que les instructeurs peuvent uploader.
                  Assurez-vous que votre serveur supporte cette limite.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type="submit">
            Enregistrer les modifications
          </Button>
        </form>
      </Form>
    </div>
  );
};
