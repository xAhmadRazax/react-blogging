import { config } from "dotenv";

import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import * as schema from "./schema"; // Ensure this matches your project structure

config({ path: ".env.local" }); // Explicitly load the file

// 1. Configure Neon for Node.js environment
// This allows the serverless driver to use WebSockets in a non-browser environment
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

console.log(connectionString);

if (!connectionString) {
  throw new Error(
    "❌ DATABASE_URL environment variable is not set.\n" +
      "Add it to your .env file:\n" +
      "DATABASE_URL=postgresql://user:password@host/database",
  );
}

// 2. Create the Pool (WebSocket based)
// We use a pool instead of a single client for better session/transaction management
const pool = new Pool({ connectionString });

// 3. Initialize Drizzle with the Pool
export const db = drizzle(pool, { schema });

// 4. Test connection
export async function testConnection() {
  try {
    // With a Pool, we use .connect() or just run a query
    const client = await pool.connect();
    await client.query("SELECT NOW()");
    client.release(); // Always release the client back to the pool!

    console.log("✅ Database connection successful (WebSockets)");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
