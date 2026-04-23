import express, { NextFunction, Request, Response } from "express";
import { SubBannerController } from "./subbanner.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { SubBannerValidation } from "./subbanner.validatio";

const router = express.Router();


router.post(
  "/create-sub-banner",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SubBannerValidation.createSubBannerValidation.parse(
      JSON.parse(req.body.data)
    );

    return SubBannerController.createSubBanner(req, res, next);
  }
);




router.get(
  "/",
  SubBannerController.getSubBanner
);

router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  SubBannerController.getSingleSubBanner
);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  fileUploader.upload.single("file"), // Added file handling
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = SubBannerValidation.updateSubBannerValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return SubBannerController.updateSubBanner(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OFFICESTAFF),
  SubBannerController.deleteSubBanner
);

export const SubBannerRoutes = router;