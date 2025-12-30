import { PrismaClient, UserRole } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  const email = "ido@admin.com";
  const password = "ido";
  const name = "ido";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await db.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      console.log("User already exists. Updating role and password...");
      await db.user.update({
        where: { email },
        data: {
          role: UserRole.ADMIN,
          password: hashedPassword,
          name: name,
        }
      });
      console.log("User updated successfully.");
    } else {
      console.log("Creating new admin user...");
      await db.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: UserRole.ADMIN,
        },
      });
      console.log("Admin user created successfully.");
    }

    console.log(`
      Admin credentials:
      Email: ${email}
      Password: ${password}
    `);

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
