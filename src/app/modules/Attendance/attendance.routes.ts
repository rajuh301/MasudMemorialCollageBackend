import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { AttendanceValidation } from "./attendance.validation";
import { AttendanceController } from "./attendance.controller";

const router = express.Router();

// 1. Register teacher face descriptor (Admin only)
router.post(
  "/:id/register-face",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AttendanceValidation.registerFaceValidation),
  AttendanceController.registerFace
);

// 2. Get all teachers with face descriptors (for scanner — Admin only)
router.get(
  "/with-descriptors",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AttendanceController.getAllTeachersWithDescriptors
);

// 3. Submit attendance via face recognition (Admin/camera machine)
router.post(
  "/submit",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AttendanceValidation.createAttendanceValidation),
  AttendanceController.createAttendance
);

// 4. Admin: get ALL attendances — supports ?teacherId=&date= filters
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AttendanceController.getAllAttendances
);

// 5. Teacher: get their OWN attendances
router.get(
  "/my",
  auth(UserRole.TEACHER),
  AttendanceController.getMyAttendances
);

export const AttendanceRoutes = router;