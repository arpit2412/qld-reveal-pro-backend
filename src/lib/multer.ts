import multer from "multer"
import path from "path";
import fs from "fs"


const rawUploadDir = path.join(__dirname, "../uploads", "raw");
fs.mkdirSync(rawUploadDir, { recursive: true });

const mergedDir = path.join(__dirname, "../uploads", "merged");
fs.mkdirSync(mergedDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rawUploadDir); // Save files to /uploads/raw
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

export {storage}