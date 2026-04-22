import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { fileUploader } from "../../../helpars/fileUploader";
import { GovermentBodyValidation } from "./Govermentbody.validation";
import { GovermentBodyController } from "./Govermentbody.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = GovermentBodyValidation.createGovermentBodyValidation.parse(
      JSON.parse(req.body.data)
    );
    return GovermentBodyController.createGovermentBody(req, res, next);
  }
);

router.get("/", GovermentBodyController.getAllGovermentBodies);

router.get("/:id", GovermentBodyController.getSingleGovermentBody);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = GovermentBodyValidation.updateGovermentBodyValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return GovermentBodyController.updateGovermentBody(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  GovermentBodyController.deleteGovermentBody
);

export const GovermentBodyRoutes = router;