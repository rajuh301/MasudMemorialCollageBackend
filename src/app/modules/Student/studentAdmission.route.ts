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
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the data from form-data
      const data = req.body.data ? JSON.parse(req.body.data) : req.body;
      
      // Validate the data
      const validatedData = createStudentAdmissionValidation.parse(data);
      
      // Attach validated data to request body
      req.body = validatedData;
      
      // Call the controller
      return studentController.createStudentAdmission(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

export const StudentAdmissionRoutes = router;