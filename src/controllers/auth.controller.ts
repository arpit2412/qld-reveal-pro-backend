import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const signupController = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
