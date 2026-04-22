"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const news_controller_1 = require("./news.controller");
const news_validation_1 = require("./news.validation");
const router = express_1.default.Router();
router.post("/create-news", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(news_validation_1.createNewsValidation), news_controller_1.NewsController.createNews);
router.get("/", news_controller_1.NewsController.getNews);
router.get("/:id", news_controller_1.NewsController.getSingleNews);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(news_validation_1.updateNewsValidation), news_controller_1.NewsController.updateNews);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), news_controller_1.NewsController.deleteNews);
exports.NewsRoutes = router;
