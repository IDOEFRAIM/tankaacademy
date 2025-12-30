import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export const UploadService = {
  /**
   * BINDING : Lie une URL de fichier à une leçon ou un cours
   */
  async bindFileToLesson(lessonId: string, url: string, type: "VIDEO" | "ATTACHMENT") {
    try {
      if (type === "VIDEO") {
        return await prisma.lesson.update({
          where: { id: lessonId },
          data: { videoUrl: url },
        });
      }
      
      // Pour les documents (PDF, Exercices, etc.)
      return await prisma.attachment.create({
        data: {
          lessonId,
          url,
          name: url.split("/").pop() || "Ressource sans nom",
        },
      });
    } catch (error) {
      console.error("[UPLOAD_BIND_ERROR]", error);
      throw new Error("Échec de l'enregistrement du fichier en base de données.");
    }
  },

  /**
   * NETTOYAGE : Supprime la référence en prisma
   */
  async deleteFile(fileId: string, type: "VIDEO" | "ATTACHMENT") {
    try {
      if (type === "VIDEO") {
        // Pour la vidéo, on remet l'URL à null (le fichier reste lié à la leçon)
        return await prisma.lesson.update({
          where: { id: fileId }, // Ici fileId est l'ID de la leçon
          data: { videoUrl: null },
        });
      }
      
      // Pour un attachement, on supprime carrément la ligne
      return await prisma.attachment.delete({
        where: { id: fileId },
      });
    } catch (error) {
      console.error("[UPLOAD_DELETE_ERROR]", error);
      throw new Error("Erreur lors de la suppression du fichier.");
    }
  },

  /**
   * FILESYSTEM : Supprime le fichier physique du disque
   */
  async deletePhysicalFile(fileUrl: string) {
    try {
      if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;

      const filename = fileUrl.replace("/uploads/", "");
      const filepath = path.join(process.cwd(), "public/uploads", filename);

      await unlink(filepath);
      console.log(`[FILE_DELETED] ${filepath}`);
    } catch (error) {
      console.error("[DELETE_PHYSICAL_FILE_ERROR]", error);
      // On ne throw pas d'erreur ici pour ne pas bloquer le processus principal
    }
  },

  /**
   * SÉCURITÉ : Vérifie si l'utilisateur a le droit d'uploader
   * Basé sur les rôles définis dans use-auth (Admin ou Instructeur propriétaire)
   */
  async canUserUpload(userId: string, courseId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    // Un Admin peut tout uploader
    if (user?.role === "ADMIN") return true;

    // Un instructeur ne peut uploader que sur ses propres cours
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId, 
        instructorId: userId 
      },
    });

    return !!course;
  },

  /**
   * RÉCUPÉRATION : Liste des ressources d'une leçon
   */
  async getLessonAttachments(lessonId: string) {
    return await prisma.attachment.findMany({
      where: { lessonId },
      orderBy: { createdAt: "desc" }
    });
  }
};