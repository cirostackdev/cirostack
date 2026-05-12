import { defineConfig } from "prisma/config";
import { config } from "dotenv";

const { parsed } = config({ path: ".env.local" });
const DATABASE_URL = parsed?.DATABASE_URL ?? process.env.DATABASE_URL ?? "";

export default defineConfig({
  datasource: {
    url: DATABASE_URL,
  },
});
