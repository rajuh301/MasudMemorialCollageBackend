"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const department_controller_1 = require("./department.controller");
const department_validation_1 = require("./department.validation");
const router = express_1.default.Router();
router.post("/create-department", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(department_validation_1.DepartmentValidation.createDepartmentValidation), department_controller_1.DepartmentController.createDepartment);
router.get("/", department_controller_1.DepartmentController.getDepartments);
router.get("/:id", department_controller_1.DepartmentController.getSingleDepartment);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(department_validation_1.DepartmentValidation.updateDepartmentValidation), department_controller_1.DepartmentController.updateDepartment);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), department_controller_1.DepartmentController.deleteDepartment);
exports.DepartmentRoutes = router;
