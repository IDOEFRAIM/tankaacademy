"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  BookOpen,
  User,
  Mail,
  Lock
} from "lucide-react";

import { RegisterSchema } from "@/schemas/auth";
import { register } from "@/actions/register";

// UI Shadcn
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";

export const RegisterForm = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  // Empêche les erreurs d'hydratation sur Next.js 16
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: UserRole.STUDENT,
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const result = await register(values);
        if (result.success) {
          setSuccess(result.message);
          form.reset();
          setTimeout(() => {
            router.push("/auth/login");
          }, 2000);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("Une erreur inattendue est survenue.");
      }
    });
  };

  if (!isMounted) return null;

  return (
    <Card className="w-full shadow-xl border-none bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-center text-slate-800">
          Créer un compte
        </CardTitle>
        <CardDescription className="text-center text-slate-500">
          Rejoignez la plateforme d'apprentissage TANKA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* CHOIX DU RÔLE */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Je suis un :</FormLabel>
                  <Select 
                    disabled={isPending} 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white border-slate-200 focus:ring-blue-500">
                        <SelectValue placeholder="Choisir un profil" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.STUDENT} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span>Étudiant</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={UserRole.INSTRUCTOR} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-emerald-500" />
                          <span>Instructeur</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* NOM */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Nom complet</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                        className="pl-10 bg-white border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        type="email"
                        placeholder="nom@exemple.com"
                        disabled={isPending}
                        className="pl-10 bg-white border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* MOT DE PASSE */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        className="pl-10 bg-white border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CONFIRMATION MOT DE PASSE */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700">Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        disabled={isPending}
                        className="pl-10 bg-white border-slate-200"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALERTES ERREUR / SUCCÈS */}
            <div className="space-y-2">
              {error && (
                <div className="flex items-center gap-x-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm animate-pulse">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-x-2 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <p>{success}</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : "Creer son compte"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};