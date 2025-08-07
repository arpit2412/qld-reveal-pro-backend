import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    database: "postgres",
    host: "aws-0-ap-southeast-2.pooler.supabase.com",
    password: ".zMePh8m%47iprt",
    port: 6543,
    user: "postgres.ecpgbrofjdxlquaalbmh",
    ssl: {
      rejectUnauthorized: false
    },
  },

});
