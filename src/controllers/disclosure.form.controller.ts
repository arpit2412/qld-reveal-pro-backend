import { Request, Response } from "express";
import * as disclosureFormService from "../services/disclosure.form.service";

export const createFormController = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      propertyAddress,
      propertyDetails,
      formData,
      formPart,
      status,
    } = req.body;
    
    let documents: Express.Multer.File[] | undefined;

    if (Array.isArray(req.files)) {
      documents = req.files as Express.Multer.File[];
    } else if (req.files && typeof req.files === "object") {
      documents = Object.values(req.files).flat();
    }

    if (!userId || !propertyAddress) {
      return res
        .status(400)
        .json({ error: "userId and propertyAddress are required" });
    }

    const { formId } = await disclosureFormService.createDisclosureForm({
      userId,
      propertyAddress,
      propertyDetails,
      formData,
      formPart,
      status,
      documents,
    });

    res.status(201).json({
      message:
        status === "draft"
          ? "Draft saved"
          : "Disclosure submitted successfully",
      formId,
    });
    return;
  } catch (error: any) {
    console.error("Error creating disclosure form:", error);
    res.status(500).json({ error: error.message });
    return;
  }
};
