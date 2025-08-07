import * as dotenv from "dotenv"
dotenv.config()

interface config {
    serverPort: string,
    databaseUrl: string,
    frontend: string,
    sbKey: string,
}

export const config: config = {
    serverPort: process.env.PORT!,
    databaseUrl: process.env.DATABASE_URL!,
    frontend: process.env.FRONTEND!,
    sbKey: process.env.SUPABASE_PUBLISHABLE_KEY!
}