"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react"; // Ajout de useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { LoginSchema } from "@/schemas/auth";
import { login } from "@/actions/login";

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const LoginForm = () => {
  // --- PROTECTION HYDRATATION ---
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // ------------------------------

  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const data = await login(values);
        
        if (data?.success) {
          setSuccess(data.message);
          router.push("/");
          router.refresh(); 
        } else {
          setError(data?.error || "Identifiants invalides");
        }
      } catch (err) {
        setError("Une erreur inattendue est survenue.");
      }
    });
  };

  // Empêche le rendu désynchronisé entre serveur et client
  if (!isMounted) return null;

  return (
    <Card className="w-full max-w-[400px] shadow-lg border-t-4 border-t-blue-600">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
        <CardDescription className="text-center text-slate-500">
          Ravi de vous revoir sur TankaAcademy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* CHAMP EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="email"
                      placeholder="votre@email.com"
                      autoComplete="email" // Aide le navigateur
                      className="bg-slate-50 focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CHAMP MOT DE PASSE */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password" // Aide le navigateur
                      className="bg-slate-50 focus-visible:ring-blue-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ALERTES AVEC ANIMATION */}
            {error && (
              <div className="flex items-center gap-x-2 p-3 rounded-md bg-destructive/15 text-destructive text-sm border border-destructive/20 animate-in fade-in zoom-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-x-2 p-3 rounded-md bg-emerald-500/15 text-emerald-500 text-sm border border-emerald-500/20 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 font-semibold active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};