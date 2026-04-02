import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { AttendanceValidation } from "./attendance.validation";
import { AttendanceController } from "./attendance.controller";

const router = express.Router();

// Register teacher face descriptor
router.post(
  "/:id/register-face",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(AttendanceValidation.registerFaceValidation),
  AttendanceController.registerFace
);

// Get all teachers who have a registered face
router.get(
  "/with-descriptors",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AttendanceController.getAllTeachersWithDescriptors
);
router.post(
  "/submit",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), // শুধুমাত্র এডমিন ক্যামেরা দিয়ে এটি করতে পারবে
  validateRequest(AttendanceValidation.createAttendanceValidation),
  AttendanceController.createAttendance
);

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  AttendanceController.getAllAttendances
);

export const AttendanceRoutes = router;