"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const attendance_validation_1 = require("./attendance.validation");
const attendance_controller_1 = require("./attendance.controller");
const router = express_1.default.Router();
// 1. Register teacher face descriptor (Admin only)
router.post("/:id/register-face", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(attendance_validation_1.AttendanceValidation.registerFaceValidation), attendance_controller_1.AttendanceController.registerFace);
// 2. Get all teachers with face descriptors (for scanner — Admin only)
router.get("/with-descriptors", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), attendance_controller_1.AttendanceController.getAllTeachersWithDescriptors);
// 3. Submit attendance via face recognition (Admin/camera machine)
router.post("/submit", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(attendance_validation_1.AttendanceValidation.createAttendanceValidation), attendance_controller_1.AttendanceController.createAttendance);
// 4. Admin: get ALL attendances — supports ?teacherId=&date= filters
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), attendance_controller_1.AttendanceController.getAllAttendances);
// 5. Teacher: get their OWN attendances
router.get("/my", (0, auth_1.default)(client_1.UserRole.TEACHER), attendance_controller_1.AttendanceController.getMyAttendances);
exports.AttendanceRoutes = router;
