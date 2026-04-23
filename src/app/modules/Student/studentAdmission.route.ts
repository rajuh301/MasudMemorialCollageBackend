import express, { NextFunction, Request, Response } from "express";
import { StudentAdmissionController } from "./studentAdmission.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { createStudentAdmissionValidation } from "./studentAdmission.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

// ─── Create Admission (Admin only) ───────────────────────────────────────────
// Auto-creates User (STUDENT role) + Student record
// Default password = dateOfBirth in DD/MM/YYYY format
router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = createStudentAdmissionValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return StudentAdmissionController.createStudentAdmission(req, res, next);
  }
);

// ─── Change Password (Student first login & thereafter) ──────────────────────
router.post(
  "/change-password",
  auth(UserRole.STUDENT),
  StudentAdmissionController.changePassword
);

// ─── Get All Admissions (Admin) ───────────────────────────────────────────────
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  StudentAdmissionController.getAllStudentAdmissions
);

// ─── Get Single Admission ─────────────────────────────────────────────────────
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF, UserRole.STUDENT),
  StudentAdmissionController.getSingleStudentAdmission
);

// ─── Update Admission (Admin) ─────────────────────────────────────────────────
router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = createStudentAdmissionValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return StudentAdmissionController.updateStudentAdmission(req, res, next);
  }
);

// ─── Delete Admission (Admin) ─────────────────────────────────────────────────
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  StudentAdmissionController.deleteStudentAdmission
);

export const StudentAdmissionRoutes = router;