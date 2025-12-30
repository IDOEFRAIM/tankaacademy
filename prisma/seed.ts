
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    await prisma.category.createMany({
      data: [
        { name: "Informatique" },
        { name: "Musique" },
        { name: "Fitness" },
        { name: "Photographie" },
        { name: "Comptabilité" },
        { name: "Ingénierie" },
        { name: "Cinéma" },
      ],
      skipDuplicates: true,
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
