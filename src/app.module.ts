import { Application } from "express";
import { authRouter } from "./routes";

export const AppModule = (app: Application) => {
  app.use("/auth", authRouter);
};
