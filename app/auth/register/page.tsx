import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Le formulaire contient déjà sa propre Card Shadcn */}
        <RegisterForm />
        
        {/* Lien de redirection externe au formulaire pour plus de clarté */}
        <div className="flex flex-col gap-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link 
              href="/auth/login" 
              className="font-semibold text-blue-600 hover:underline underline-offset-4"
            >
              Se connecter
            </Link>
          </p>

          <p className="px-8 text-center text-xs text-slate-400 leading-relaxed">
            En s'inscrivant, vous acceptez nos{" "}
            <Link href="/terms" className="underline hover:text-slate-600">Conditions d'utilisation</Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="underline hover:text-slate-600">Politique de confidentialité</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}