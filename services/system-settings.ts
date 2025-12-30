import { prisma } from "@/lib/prisma";

export const SystemSettingsService = {
  async get(key: string, defaultValue: string = ""): Promise<string> {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });

    return setting?.value || defaultValue;
  },

  async set(key: string, value: string, description?: string) {
    return await prisma.systemSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  },
  
  async getUploadLimit(): Promise<number> {
      const limit = await this.get("UPLOAD_LIMIT_BYTES", "2147483648"); // 2GB default
      return parseInt(limit, 10);
  }
};
