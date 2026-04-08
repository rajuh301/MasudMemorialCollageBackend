import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AccountController } from "./account.controller";
import { AccountValidation } from "./account.validation";

const router = express.Router();

// Get full statement and summary
router.get(
    "/statement",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    AccountController.getAccountStatement
);

// Create new Cash In / Cash Out entry
router.post(
    "/transaction",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(AccountValidation.createTransaction),
    AccountController.createTransaction
);

export const AccountRoutes = router;