"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubBannerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const subbanner_controller_1 = require("./subbanner.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const subbanner_validatio_1 = require("./subbanner.validatio");
const router = express_1.default.Router();
router.post("/create-sub-banner", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = subbanner_validatio_1.SubBannerValidation.createSubBannerValidation.parse(JSON.parse(req.body.data));
    return subbanner_controller_1.SubBannerController.createSubBanner(req, res, next);
});
router.get("/", subbanner_controller_1.SubBannerController.getSubBanner);
router.get("/:id", subbanner_controller_1.SubBannerController.getSingleSubBanner);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), subbanner_controller_1.SubBannerController.updateSubBanner);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), subbanner_controller_1.SubBannerController.deleteSubBanner);
exports.SubBannerRoutes = router;
