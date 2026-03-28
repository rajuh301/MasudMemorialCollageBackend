import express, { NextFunction, Request, Response } from "express";
import { OurTeachersController } from "./ourTeachers.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { OurTeachersValidation } from "./ourTeachers.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.post(
  "/create-teacher",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = OurTeachersValidation.createOurTeacherValidation.parse(
      JSON.parse(req.body.data)
    );

    return OurTeachersController.createOurTeacher(req, res, next);
  }
);

router.get("/", OurTeachersController.getOurTeachers);

router.get("/:id", OurTeachersController.getSingleOurTeacher);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    // This part is what actually fills req.body
    if (req.body.data) {
      req.body = OurTeachersValidation.updateOurTeacherValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return OurTeachersController.updateOurTeacher(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  OurTeachersController.deleteOurTeacher
);

export const OurTeachersRoutes = router;