import express, { NextFunction, Request, Response } from "express";
import { StudentsCommentController } from "./studentsComment.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { StudentsCommentValidation } from "./studentsComment.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();


router.post(
    "/create-student-comment",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF, UserRole.TEACHER),
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = StudentsCommentValidation.createStudentsCommentValidation.parse(
            JSON.parse(req.body.data)
        );

        return StudentsCommentController.createStudentsComment(req, res, next);
    }
);



router.get("/", StudentsCommentController.getStudentsComment);
router.get("/:id", StudentsCommentController.getSingleStudentsComment);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF, UserRole.TEACHER),
    fileUploader.upload.single("file"), // 1. Handle file
    (req: Request, res: Response, next: NextFunction) => {
        // 2. Parse and validate JSON from 'data' field
        if (req.body.data) {
            req.body = StudentsCommentValidation.updateStudentsCommentValidation.parse(
                JSON.parse(req.body.data)
            );
        }
        return StudentsCommentController.updateStudentsComment(req, res, next);
    }
);


router.delete("/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF, UserRole.TEACHER),

    StudentsCommentController.deleteStudentsComment);

export const StudentsCommentRoutes = router;