"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAdmissionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const studentAdmission_controller_1 = require("./studentAdmission.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const studentAdmission_validation_1 = require("./studentAdmission.validation");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
// ─── Create Admission (Admin only) ───────────────────────────────────────────
// Auto-creates User (STUDENT role) + Student record
// Default password = dateOfBirth in DD/MM/YYYY format
router.post("/create", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = studentAdmission_validation_1.createStudentAdmissionValidation.parse(JSON.parse(req.body.data));
    }
    return studentAdmission_controller_1.StudentAdmissionController.createStudentAdmission(req, res, next);
});
// ─── Change Password (Student first login & thereafter) ──────────────────────
router.post("/change-password", (0, auth_1.default)(client_1.UserRole.STUDENT), studentAdmission_controller_1.StudentAdmissionController.changePassword);
// ─── Get All Admissions (Admin) ───────────────────────────────────────────────
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF), studentAdmission_controller_1.StudentAdmissionController.getAllStudentAdmissions);
// ─── Get Single Admission ─────────────────────────────────────────────────────
router.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.STUDENT), studentAdmission_controller_1.StudentAdmissionController.getSingleStudentAdmission);
// ─── Update Admission (Admin) ─────────────────────────────────────────────────
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = studentAdmission_validation_1.createStudentAdmissionValidation.parse(JSON.parse(req.body.data));
    }
    return studentAdmission_controller_1.StudentAdmissionController.updateStudentAdmission(req, res, next);
});
// ─── Delete Admission (Admin) ─────────────────────────────────────────────────
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF), studentAdmission_controller_1.StudentAdmissionController.deleteStudentAdmission);
exports.StudentAdmissionRoutes = router;
