import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BannerValidation } from "./banner.validation";
import { BannerController } from "./banner.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.post(
  "/create-banner",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BannerValidation.createBannerValidation.parse(
      JSON.parse(req.body.data)
    );
    return BannerController.createBanner(req, res, next);

  }
);




router.get(
  "/",
  BannerController.getBanner
);
router.get(
  "/:id",
  BannerController.getSingleBanner
);


router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      // This correctly populates req.body with the validated fields
      req.body = BannerValidation.updateBannerValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return BannerController.updateBanner(req, res, next);
  }
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  BannerController.deleteBanner
);

export const BannerRoutes = router;