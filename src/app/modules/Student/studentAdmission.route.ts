import express, { Request, Response, NextFunction } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { createStudentAdmissionValidation } from "./studentAdmission.validation";
import { createStudentAdmission } from "./studentAdmission.controller";

const router = express.Router();

router.post(
  "/create-student-admission",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"), // student image
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

      req.body = createStudentAdmissionValidation.parse(data);
      return createStudentAdmission(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export const StudentAdmissionRoutes = router;