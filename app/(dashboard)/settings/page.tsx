import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsForm } from "./_components/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return redirect("/");
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Paramètres du compte</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </div>
      <SettingsForm initialData={{ name: user.name || "" }} />
    </div>
  );
}
