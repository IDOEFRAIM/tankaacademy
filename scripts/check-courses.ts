import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  const email = "efra@gmail.com";
  console.log(`Checking courses for instructor ${email}...`);
  
  const user = await db.user.findUnique({
    where: { email },
    include: {
        courses: true
    }
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log(`User found: ${user.name} (${user.role})`);
  console.log(`Courses count: ${user.courses.length}`);
  user.courses.forEach(c => {
      console.log(`- [${c.status}] ${c.title} (ID: ${c.id})`);
  });

  const allCourses = await db.course.findMany({
      where: { status: "PUBLISHED" } 
  });
  // Actually, in the seed script I used `status: "PUBLISHED"`. Prisma Client is typed. If it compiled/ran with 'tsx', it likely accepted the string matching the enum.
  
  console.log(`\nTotal Published Courses in DB: ${allCourses.length}`);
  allCourses.forEach(c => {
      console.log(`- ${c.title} (${c.id})`);
  });

}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await db.$disconnect();
  });
