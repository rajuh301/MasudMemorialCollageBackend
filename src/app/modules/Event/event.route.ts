import express, { NextFunction, Request, Response } from "express";
import { EventController } from "./event.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { EventValidation } from "./event.validation";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();


router.post(
  "/create-event",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = EventValidation.createEventValidation.parse(
      JSON.parse(req.body.data)
    );

    return EventController.createEvent(req, res, next);
  }
);


router.get("/", EventController.getEvent);

router.get("/:id", EventController.getSingleEvent);

router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  fileUploader.upload.single("file"), // Handle file in update
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = EventValidation.updateEventValidation.parse(
        JSON.parse(req.body.data)
      );
    }
    return EventController.updateEvent(req, res, next);
  }
);

router.delete("/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  EventController.deleteEvent);

export const EventRoutes = router;