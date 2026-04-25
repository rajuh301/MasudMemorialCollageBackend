"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsCommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const studentsComment_controller_1 = require("./studentsComment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const studentsComment_validation_1 = require("./studentsComment.validation");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router.post("/create-student-comment", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.TEACHER), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = studentsComment_validation_1.StudentsCommentValidation.createStudentsCommentValidation.parse(JSON.parse(req.body.data));
    return studentsComment_controller_1.StudentsCommentController.createStudentsComment(req, res, next);
});
router.get("/", studentsComment_controller_1.StudentsCommentController.getStudentsComment);
router.get("/:id", studentsComment_controller_1.StudentsCommentController.getSingleStudentsComment);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.TEACHER), fileUploader_1.fileUploader.upload.single("file"), // 1. Handle file
(req, res, next) => {
    // 2. Parse and validate JSON from 'data' field
    if (req.body.data) {
        req.body = studentsComment_validation_1.StudentsCommentValidation.updateStudentsCommentValidation.parse(JSON.parse(req.body.data));
    }
    return studentsComment_controller_1.StudentsCommentController.updateStudentsComment(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.TEACHER), studentsComment_controller_1.StudentsCommentController.deleteStudentsComment);
exports.StudentsCommentRoutes = router;
