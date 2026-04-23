import express from "express";
import { ResultController } from "./result.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ResultValidation } from "./result.validation";
import auth from "../../middlewares/auth"; // ✅ Fixed path
import { UserRole } from "@prisma/client";

const router = express.Router();

// Admin / Teacher creates result
router.post(
  "/create-result",
  auth(UserRole.SUPER_ADMIN, UserRole.OFFICESTAFF, UserRole.ADMIN),
  validateRequest(ResultValidation.createResultValidation),
  ResultController.createResult
);

// Student searches result by roll + department
router.get(
  "/student-result",
  ResultController.getStudentResult
);

// Latest results
router.get("/latest", ResultController.getLatestResults);

// All results
router.get("/", ResultController.getAllResults);

export const ResultRoutes = router;