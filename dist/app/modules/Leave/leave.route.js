"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRoutes = void 0;
const express_1 = __importDefault(require("express"));
const leave_controller_1 = require("./leave.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const leave_validation_1 = require("./leave.validation");
const router = express_1.default.Router();
// Any authenticated user can apply for leave
router.post("/apply", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.TEACHER, client_1.UserRole.OFFICESTAFF), (0, validateRequest_1.default)(leave_validation_1.LeaveValidation.createLeaveValidation), leave_controller_1.LeaveController.applyLeave);
// Get all leaves (admin only)
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.STUDENT, client_1.UserRole.TEACHER, client_1.UserRole.OFFICESTAFF), leave_controller_1.LeaveController.getAllLeaves);
// Get my own leaves (any authenticated user)
router.get("/my-leaves", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.TEACHER, client_1.UserRole.OFFICESTAFF, client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), leave_controller_1.LeaveController.getMyLeaves);
// Get single leave by id
router.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.STUDENT, client_1.UserRole.TEACHER, client_1.UserRole.OFFICESTAFF), leave_controller_1.LeaveController.getSingleLeave);
// Admin approves or declines a leave
router.patch("/:id/status", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(leave_validation_1.LeaveValidation.updateLeaveStatusValidation), leave_controller_1.LeaveController.updateLeaveStatus);
// Delete leave (admin or owner)
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), leave_controller_1.LeaveController.deleteLeave);
exports.LeaveRoutes = router;
