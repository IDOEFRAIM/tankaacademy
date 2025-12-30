"use server";

import { SystemSettingsService } from "@/services/system-settings";

export const getUploadLimit = async () => {
  return await SystemSettingsService.getUploadLimit();
};
