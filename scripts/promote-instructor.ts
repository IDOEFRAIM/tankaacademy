import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("Veuillez fournir une adresse email.");
    console.log("Usage: npx tsx scripts/promote-instructor.ts <email>");
    return;
  }

  try {
    const user = await db.user.update({
      where: { email },
      data: { role: "INSTRUCTOR" },
    });

    console.log(`L'utilisateur ${user.email} a été promu au rôle INSTRUCTOR.`);
  } catch (error) {
    console.error("Erreur lors de la promotion de l'utilisateur:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
