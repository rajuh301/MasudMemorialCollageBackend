import express, { Request, Response, NextFunction } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { createStudentAdmissionValidation } from "./studentAdmission.validation";
import { studentController } from "./studentAdmission.controller";

const router = express.Router();

router.post(
  "/create-student-admission",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const data = req.body.data ? JSON.parse(req.body.data) : req.body;

      const validatedData = createStudentAdmissionValidation.parse(data);

      req.body = validatedData;

      return studentController.createStudentAdmission(req, res, next);

    } catch (error) {
      next(error);
    }
  }
);

export const StudentAdmissionRoutes = router;