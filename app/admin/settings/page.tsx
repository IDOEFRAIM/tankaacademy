import { SystemSettingsService } from "@/services/system-settings";
import { SystemSettingsForm } from "./_components/settings-form";

export default async function AdminSettingsPage() {
  const uploadLimit = await SystemSettingsService.getUploadLimit();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres Système</h1>
      <SystemSettingsForm initialLimit={uploadLimit.toString()} />
    </div>
  );
}
