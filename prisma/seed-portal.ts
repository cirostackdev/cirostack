import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const clients = [
  { email: "jessychideraonah@gmail.com", name: "Jessy Chidera Onah", company: "CiroStack" },
];

async function main() {
  for (const data of clients) {
    const existing = await prisma.client.findUnique({ where: { email: data.email } });
    if (existing) {
      console.log(`Client ${data.email} already exists. Skipping.`);
      continue;
    }
    const client = await prisma.client.create({ data });
    console.log(`Created client: ${client.email} (id: ${client.id})`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
