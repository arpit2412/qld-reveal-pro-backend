import express, { Request, Response } from "express";
import cors from "cors";
import * as cookieParser from "cookie-parser";
import { config } from "./config/config";
import { connectDB } from "./db/connectDB";
import { AppModule } from "./app.module";
import path from "path";

const app = express();

const allowedOrigins = [config.frontend];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser.default());
app.use(express.json());

connectDB(config.databaseUrl);

AppModule(app);

app.use("/uploads", express.static(path.join(__dirname, "controllers", "uploads")));

app.get("/health-check", (req: Request, res: Response) => {
  res.status(200).send(`<h1>SmartGuru Version 2 is up and running.</h1>`);
  return;
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).send(`<h1>SmartGuru Version 2 is up and running.</h1>`);
  return;
});


app.listen(config.serverPort, () => {
  console.log(
    `Formly is up and running at http://localhost:${config.serverPort}`
  );
});
