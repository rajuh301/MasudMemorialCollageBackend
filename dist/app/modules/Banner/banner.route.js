"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const banner_validation_1 = require("./banner.validation");
const banner_controller_1 = require("./banner.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router.post("/create-banner", fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = banner_validation_1.BannerValidation.createBannerValidation.parse(JSON.parse(req.body.data));
    return banner_controller_1.BannerController.createBanner(req, res, next);
});
router.get("/", banner_controller_1.BannerController.getBanner);
router.get("/:id", banner_controller_1.BannerController.getSingleBanner);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(banner_validation_1.BannerValidation.updateBannerValidation), banner_controller_1.BannerController.updateBanner);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), banner_controller_1.BannerController.deleteBanner);
exports.BannerRoutes = router;
