"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsCommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const studentsComment_controller_1 = require("./studentsComment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const studentsComment_validation_1 = require("./studentsComment.validation");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router.post("/create-student-comment", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = studentsComment_validation_1.StudentsCommentValidation.createStudentsCommentValidation.parse(JSON.parse(req.body.data));
    return studentsComment_controller_1.StudentsCommentController.createStudentsComment(req, res, next);
});
router.get("/", studentsComment_controller_1.StudentsCommentController.getStudentsComment);
router.get("/:id", studentsComment_controller_1.StudentsCommentController.getSingleStudentsComment);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(studentsComment_validation_1.StudentsCommentValidation.updateStudentsCommentValidation), studentsComment_controller_1.StudentsCommentController.updateStudentsComment);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), studentsComment_controller_1.StudentsCommentController.deleteStudentsComment);
exports.StudentsCommentRoutes = router;
