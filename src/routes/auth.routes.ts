import { Router } from "express";
import { loginController, signupController } from "../controllers";

const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);

export { authRouter };
