import express from "express";
import { ResultController } from "./result.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ResultValidation } from "./result.validation";

const router = express.Router();

// Admin / Teacher creates result
router.post(
  "/create-result",
  validateRequest(ResultValidation.createResultValidation),
  ResultController.createResult
);
// Student searches result by roll + department
router.get(
  "/student-result",
  // validateRequest(getStudentResultValidation),
  ResultController.getStudentResult
);

// Latest results
router.get("/latest", ResultController.getLatestResults);

// All results
router.get("/", ResultController.getAllResults);

export const ResultRoutes = router;