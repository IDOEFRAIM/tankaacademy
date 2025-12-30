import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Le LoginForm gère déjà sa propre Card stylisée */}
        <LoginForm />
        
        <div className="flex flex-col gap-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Nouveau sur TankaAcademy ?{" "}
            <Link 
              href="/auth/register" 
              className="font-semibold text-blue-600 hover:underline underline-offset-4"
            >
              Créer un compte
            </Link>
          </p>

          {/* Liens utilitaires discrets */}
          <div className="flex justify-center items-center gap-x-4 text-xs text-slate-400">
            <Link href="/" className="hover:text-slate-600 transition">
              Retour à l'accueil
            </Link>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <Link href="#" className="hover:text-slate-600 transition">
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}