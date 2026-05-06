import express from "express";
import { StudentNoticeController } from "./studentNotice.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { StudentNoticeValidation } from "./studentNotice.validation";

const router = express.Router();

// Create
router.post(
    "/create",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER),
    validateRequest(StudentNoticeValidation.createStudentNoticeValidation),
    StudentNoticeController.createStudentNotice
);

// Get all
router.get("/", StudentNoticeController.getAllStudentNotices);

// Get by department
router.get(
    "/department/:departmentId",
    StudentNoticeController.getNoticesByDepartment
);


// Get by student roll
router.get(
    "/student-roll/:studentRoll",
    StudentNoticeController.getNoticesByStudentRoll
);

router.get("/own-notice",
    auth(UserRole.STUDENT),
    StudentNoticeController.ownNotice
)

// Get single
router.get("/:id", StudentNoticeController.getSingleStudentNotice);

// Update
router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER),
    validateRequest(StudentNoticeValidation.updateStudentNoticeValidation),
    StudentNoticeController.updateStudentNotice
);

// Delete
router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER),
    StudentNoticeController.deleteStudentNotice
);

export const StudentNoticeRoutes = router;