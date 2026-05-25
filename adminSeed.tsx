import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password", 10);

  await prisma.user.create({
    data: {
      name: "ido efraim",
      email: "ido.efraim@example.com", // Remplace par l'email réel si besoin
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin créé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });