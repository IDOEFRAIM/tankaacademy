"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateCourseSchema } from "@/schemas/courses";
import { createCourse } from "@/actions/courses";

const CreatePage = () => {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof CreateCourseSchema>>({
    resolver: zodResolver(CreateCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof CreateCourseSchema>) => {
    try {
      const response = await createCourse(values);
      
      if (response.error) {
        toast.error(response.error);
      } else if (response.course) {
        toast.success("Cours créé avec succès");
        router.push(`/instructor/courses/${response.course.id}`);
      }
    } catch {
      toast.error("Une erreur est survenue");
    }
  };

  return ( 
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl font-medium">
          Nommez votre cours
        </h1>
        <p className="text-sm text-slate-600">
          Comment souhaitez-vous nommer votre cours ? Ne vous inquiétez pas, vous pourrez changer cela plus tard.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Titre du cours
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ex: 'Développement Web Avancé'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce que vous enseignerez dans ce cours.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                >
                  Annuler
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Continuer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
   );
}
 
export default CreatePage;
