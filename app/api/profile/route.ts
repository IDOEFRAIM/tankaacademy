import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Récupération de "level" envoyé par ton nouveau selecteur
    const { name, password, newPassword, level } = values;

    // Objet qui contiendra toutes les données à mettre à jour
    const updateData: any = {};

    // Préparation de la mise à jour du nom
    if (name) updateData.name = name;

    // Préparation de la mise à jour du niveau (6ème à Terminale)
    if (level) updateData.level = level;

    // Gestion de la modification du mot de passe si les champs sont fournis
    if (password && newPassword) {
      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.password) {
        return new NextResponse("User not found", { status: 404 });
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        return new NextResponse("Incorrect password", { status: 400 });
      }

      // Hashage du nouveau mot de passe et ajout aux données de mise à jour
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // On exécute la mise à jour globale s'il y a des données à modifier
    if (Object.keys(updateData).length > 0) {
      await db.user.update({
        where: { id: userId },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[PROFILE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}