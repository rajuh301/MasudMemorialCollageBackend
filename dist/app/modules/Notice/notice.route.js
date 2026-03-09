"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoticeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const notice_controller_1 = require("./notice.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const notice_validation_1 = require("./notice.validation");
const router = express_1.default.Router();
router.post("/create-notice", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(notice_validation_1.NoticeValidation.createNoticeValidation), notice_controller_1.NoticeController.createNotice);
router.get("/", notice_controller_1.NoticeController.getNotice);
router.get("/:id", notice_controller_1.NoticeController.getSingleNotice);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(notice_validation_1.NoticeValidation.updateNoticeValidation), notice_controller_1.NoticeController.updateNotice);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), notice_controller_1.NoticeController.deleteNotice);
exports.NoticeRoutes = router;
