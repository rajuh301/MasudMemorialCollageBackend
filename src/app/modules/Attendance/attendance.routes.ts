import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { AttendanceValidation } from "./attendance.validation";
import { AttendanceController } from "./attendance.controller";

const router = express.Router();

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