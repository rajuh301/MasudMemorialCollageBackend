import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { DepartmentController } from "./department.controller";
import { DepartmentValidation } from "./department.validation";

const router = express.Router();

router.post(
  "/create-department",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(DepartmentValidation.createDepartmentValidation),
  DepartmentController.createDepartment
);

router.get(
  "/",
  DepartmentController.getDepartments
);

router.get(
  "/:id",
  DepartmentController.getSingleDepartment
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(DepartmentValidation.updateDepartmentValidation),
  DepartmentController.updateDepartment
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DepartmentController.deleteDepartment
);

export const DepartmentRoutes = router;