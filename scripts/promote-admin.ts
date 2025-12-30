import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.log("Please provide an email address.");
    return;
  }

  try {
    const user = await db.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`User ${user.email} has been promoted to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
