import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load .env before anything else
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema.ts", // Check if this path is 100% correct
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // The ! tells TS we know it's there
  },
});
