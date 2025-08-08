import * as dotenv from "dotenv";
dotenv.config();

interface config {
  serverPort: string;
  databaseUrl: string;
  frontend: string;
  sbKey: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export const config: config = {
  serverPort: process.env.PORT!,
  databaseUrl: process.env.DATABASE_URL!,
  frontend: process.env.FRONTEND!,
  sbKey: process.env.SUPABASE_PUBLISHABLE_KEY!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
};
