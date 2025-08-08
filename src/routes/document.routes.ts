import multer from "multer";
import { storage } from "../lib/multer";
import { Router } from "express";
import { uploadAndMerge } from "../controllers";

const docsRouter = Router();

const upload = multer({ storage });

docsRouter.post("/upload", upload.array("file"), uploadAndMerge);

export { docsRouter };
