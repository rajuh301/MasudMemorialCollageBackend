import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";

import { UserRole } from "@prisma/client";

import { NewsController } from "./news.controller";
import { createNewsValidation, updateNewsValidation } from "./news.validation";

const router = express.Router();



router.post(
  "/create-news",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createNewsValidation),
  NewsController.createNews
);



router.get(
  "/",
  NewsController.getNews
);



router.get(
  "/:id",
  NewsController.getSingleNews
);



router.patch(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(updateNewsValidation),
  NewsController.updateNews
);



router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  NewsController.deleteNews
);



export const NewsRoutes = router;