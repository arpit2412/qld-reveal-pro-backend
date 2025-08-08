import multer from "multer";
import { storage } from "../lib/multer";
import { Router } from "express";
import { createFormController, uploadAndMerge } from "../controllers";

const docsRouter = Router();

const upload = multer({ storage });

docsRouter.post("/draft", createFormController);
docsRouter.post("/submit", upload.array("file"), createFormController);
docsRouter.post("/merge", upload.array("file"), uploadAndMerge);

export { docsRouter };
