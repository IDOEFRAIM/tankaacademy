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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
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

// Schéma de validation mis à jour
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est requis",
  }),
  password: z.string().optional(),
  newPassword: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  }).optional().or(z.literal("")),
  level: z.string().optional().or(z.literal("")), // Prise en compte de "level"
});

interface SettingsFormProps {
  initialData: {
    name: string;
    level?: string | null; // typage ajusté avec la base de données
  };
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      password: "",
      newPassword: "",
      level: initialData.level || "", // Valeur initiale reçue de la BDD
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await axios.patch("/api/profile", values);
      toast.success("Profil mis à jour avec succès !");
      router.refresh();
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Nom complet */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-6">
            {/* --- SECTION MOT DE PASSE (OPTIONNEL) --- */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-500">Changer le mot de passe (optionnel)</h3>
              
              {/* Mot de passe actuel */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        disabled={isSubmitting} 
                        placeholder="******" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nouveau mot de passe */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouveau mot de passe</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        disabled={isSubmitting} 
                        placeholder="******" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <hr className="border-slate-100" />

            {/* --- SECTION NIVEAU SCOLAIRE --- */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-slate-500">Informations scolaires</h3>
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niveau de l'élève</FormLabel>
                    <Select 
                      disabled={isSubmitting} 
                      onValueChange={field.onChange} 
                      value={field.value} // Utilisation de value pour le contrôle dynamique
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white border-slate-200">
                          <SelectValue placeholder="Sélectionnez votre classe actuelle" />
                        </SelectTrigger>
                      </FormControl>
                          <SelectContent>
                    {/* Collège */}
                    <SelectItem value="SIXEME">6ème</SelectItem> {/* Remplace par la valeur exacte de l'enum */}
                    <SelectItem value="CINQUIEME">5ème</SelectItem>
                    <SelectItem value="QUATRIEME">4ème</SelectItem>
                    <SelectItem value="TROISIEME">3ème</SelectItem>
                    
                    {/* Lycée */}
                    <SelectItem value="SECONDE">Seconde</SelectItem>   {/* <-- Changé en majuscule ici */}
                    <SelectItem value="PREMIERE">Première</SelectItem>
                    <SelectItem value="TERMINALE">Terminale</SelectItem>
                  </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            <Button disabled={isSubmitting} type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};