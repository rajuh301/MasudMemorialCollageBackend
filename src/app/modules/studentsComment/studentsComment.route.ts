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
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
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

router.patch("/:id",

    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(StudentsCommentValidation.updateStudentsCommentValidation),

    StudentsCommentController.updateStudentsComment);

router.delete("/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),

    StudentsCommentController.deleteStudentsComment);

export const StudentsCommentRoutes = router;