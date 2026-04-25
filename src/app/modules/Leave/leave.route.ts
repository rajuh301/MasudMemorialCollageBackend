import express, { Request, Response, NextFunction } from "express";
import { LeaveController } from "./leave.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { LeaveValidation } from "./leave.validation";

const router = express.Router();

// Any authenticated user can apply for leave
router.post(
  "/apply",
  auth(UserRole.STUDENT, UserRole.TEACHER, UserRole.OFFICESTAFF),
  validateRequest(LeaveValidation.createLeaveValidation),
  LeaveController.applyLeave
);

// Get all leaves (admin only)
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.OFFICESTAFF),
  LeaveController.getAllLeaves
);

// Get my own leaves (any authenticated user)
router.get(
  "/my-leaves",
  auth(UserRole.STUDENT, UserRole.TEACHER, UserRole.OFFICESTAFF, UserRole.SUPER_ADMIN, UserRole.ADMIN),
  LeaveController.getMyLeaves
);

// Get single leave by id
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER, UserRole.OFFICESTAFF),
  LeaveController.getSingleLeave
);

// Admin approves or declines a leave
router.patch(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(LeaveValidation.updateLeaveStatusValidation),
  LeaveController.updateLeaveStatus
);

// Delete leave (admin or owner)
router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  LeaveController.deleteLeave
);

export const LeaveRoutes = router;