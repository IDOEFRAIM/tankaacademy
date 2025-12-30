"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/actions/comments";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Le commentaire est requis",
  }),
});

interface CommentFormProps {
  lessonId: string;
}

export const CommentForm = ({ lessonId }: CommentFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await createComment(lessonId, values.content);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Commentaire ajouté");
        form.reset();
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border rounded-md p-4 bg-slate-50">
      <h4 className="font-medium mb-2">Ajouter un commentaire</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder="Posez une question ou partagez votre avis sur cette leçon..."
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button disabled={isSubmitting} type="submit" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
