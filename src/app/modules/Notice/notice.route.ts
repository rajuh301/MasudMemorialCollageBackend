import express from "express";
import { NoticeController } from "./notice.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { NoticeValidation } from "./notice.validation";

const router = express.Router();

router.post(
    "/create-notice",
    auth(UserRole.SUPER_ADMIN, UserRole.OFFICESTAFF, UserRole.ADMIN),
    validateRequest(NoticeValidation.createNoticeValidation),
    NoticeController.createNotice
);

router.get(
    "/",
    auth(UserRole.SUPER_ADMIN, UserRole.OFFICESTAFF, UserRole.ADMIN),
    NoticeController.getNotice
);

router.get(
    "/:id",
    NoticeController.getSingleNotice
);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.OFFICESTAFF, UserRole.ADMIN),
    validateRequest(NoticeValidation.updateNoticeValidation),
    NoticeController.updateNotice
);

router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.OFFICESTAFF, UserRole.ADMIN),
    NoticeController.deleteNotice
);

export const NoticeRoutes = router;