import { defineConfig } from "drizzle-kit";
import {config} from "./src/config/config"

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    database: config.database,
    host: config.host,
    password: config.password,
    port: config.port,
    user: config.user,
    ssl: {
      rejectUnauthorized: false
    },
  },

});
