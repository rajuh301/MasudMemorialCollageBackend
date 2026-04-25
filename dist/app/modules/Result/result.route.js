"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultRoutes = void 0;
const express_1 = __importDefault(require("express"));
const result_controller_1 = require("./result.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const result_validation_1 = require("./result.validation");
const auth_1 = __importDefault(require("../../middlewares/auth")); // ✅ Fixed path
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
// Admin / Teacher creates result
router.post("/create-result", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.ADMIN, client_1.UserRole.TEACHER), // ✅ Added auth middleware
(0, validateRequest_1.default)(result_validation_1.ResultValidation.createResultValidation), result_controller_1.ResultController.createResult);
// Student searches result by roll + department
router.get("/student-result", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF, client_1.UserRole.TEACHER, client_1.UserRole.STUDENT), result_controller_1.ResultController.getStudentResult);
router.get("/result-records", result_controller_1.ResultController.getResultRecords);
router.get("/public", result_controller_1.ResultController.getPublicResult);
// Latest results
router.get("/latest", result_controller_1.ResultController.getLatestResults);
// All results
router.get("/", result_controller_1.ResultController.getAllResults);
router.delete("/delete-result/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN, client_1.UserRole.OFFICESTAFF), result_controller_1.ResultController.deleteResult);
exports.ResultRoutes = router;
