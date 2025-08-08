import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { PDFDocument } from "pdf-lib";
import supabase from "../lib/supabaseClient";

interface CreateDisclosureFormInput {
  userId: string;
  propertyAddress: string;
  propertyDetails: any;
  formData: any;
  formPart: number;
  status: string;
  documents?: Express.Multer.File[];
}

export const createDisclosureForm = async (data: CreateDisclosureFormInput) => {
  const formId = uuidv4();
  const totalParts = 6;

  const partsCompletion: Record<string, boolean> = {};
  for (let i = 1; i <= totalParts; i++) {
    partsCompletion[`part${i}`] = i < data.formPart;
  }

  // Insert into disclosure_forms
  await supabase.from("disclosure_form_data").insert({
    id: formId,
    user_id: data.userId,
    property_address: data.propertyAddress,
    property_details: data.propertyDetails,
    form_data_12: data.formData,
    current_part: data.formPart || 1,
    parts_completion: partsCompletion,
    status: data.status || "draft",
  });

  let filePath;
  if (data.documents) {
    filePath = (await mergeDocuments(data.documents)).file;
  }

  return { formId, filePath };
};

export const mergeDocuments = async (documents: Express.Multer.File[]) => {
  try {
    const rawDir = path.join(__dirname, "../uploads", "raw");
    fs.mkdirSync(rawDir, { recursive: true });

    const mergedDir = path.join(__dirname, "../uploads", "merged");
    fs.mkdirSync(mergedDir, { recursive: true });

    const uploadedFiles = documents?.map((file) => file.path);
    const baseFilePath = path.join(__dirname, "../uploads", "form.pdf");
    const filePaths = [baseFilePath, ...uploadedFiles];
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

    return {
      message: "PDFs merged and stored successfully",
      file: `/uploads/merged/${mergedFileName}`,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
