import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

export const connectDB = async (dbUri: string) => {
  try {
    pool = new Pool({ connectionString: dbUri });
    db = drizzle(pool, { schema });
    console.log("PostgreSQL (Supabase) connected");
  } catch (error: any) {
    console.error("Error connecting to PostgreSQL:", error.message);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) throw new Error("Database not connected. Call connectDB first.");
  return db;
};

export const getPool = () => {
  if (!pool) throw new Error("Pool not initialized. Call connectDB first.");
  return pool;
};
