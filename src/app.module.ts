import { Application } from "express";
import { authRouter, docsRouter } from "./routes";

export const AppModule = (app: Application) => {
  app.use("/auth", authRouter);
  app.use("/docs", docsRouter);
};
