import express, { NextFunction, Request, Response } from "express";
import { SubBannerController } from "./subbanner.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { SubBannerValidation } from "./subbanner.validatio";

const router = express.Router();


router.post(
  "/create-sub-banner",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
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
    SubBannerController.getSingleSubBanner
);

router.patch(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SubBannerController.updateSubBanner
);

router.delete(
    "/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SubBannerController.deleteSubBanner
);

export const SubBannerRoutes = router;