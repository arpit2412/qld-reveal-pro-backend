import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { PDFDocument } from "pdf-lib";


export const uploadAndMerge = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const existingPdfBytes = await fs.readFileSync(
      "src/controllers/uploads/form.pdf"
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    const fields = form.getFields();

    for (const field of fields) {
      const name = field.getName();
      const type = field.constructor.name;
      console.log(`Field Name: ${name}, Field Type: ${type}`);
    }
    form.getTextField('Seller').setText("Rakshank Verma");
    form.getTextField('Property address').setText("Jaipur");
     const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('src/controllers/uploads/form.pdf', pdfBytes);

    const rawDir = path.join(__dirname, "uploads", "raw");
    fs.mkdirSync(rawDir, { recursive: true });

    const mergedDir = path.join(__dirname, "uploads", "merged");
    fs.mkdirSync(mergedDir, { recursive: true });

    const uploadedFiles = (req.files as Express.Multer.File[]).map((file) => file.path);
    const baseFilePath = "src/controllers/uploads/form.pdf";
    const filePaths = [baseFilePath, ...uploadedFiles]
    const mergedPdf = await PDFDocument.create();


    for (const filePath of filePaths) {
    const fileBytes = fs.readFileSync(filePath);
    const pdf = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    const mergedFileName = `merged-${Date.now()}.pdf`;
    const mergedFilePath = path.join(mergedDir, mergedFileName);
    fs.writeFileSync(mergedFilePath, mergedBytes);

    // Optional: Delete raw uploaded PDFs
    // filePaths.forEach(fs.unlinkSync);

    res.json({
      message: "PDFs merged and stored successfully",
      file: `/uploads/merged/${mergedFileName}`,
    });
    return
  } catch (error: any) {
    res.json({error: error.message})
    return
  }
};
