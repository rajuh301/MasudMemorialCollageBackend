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
const router = express_1.default.Router();
// Admin / Teacher creates result
router.post("/create-result", (0, validateRequest_1.default)(result_validation_1.ResultValidation.createResultValidation), result_controller_1.ResultController.createResult);
// Student searches result by roll + department
router.get("/student-result", 
// validateRequest(getStudentResultValidation),
result_controller_1.ResultController.getStudentResult);
// Latest results
router.get("/latest", result_controller_1.ResultController.getLatestResults);
// All results
router.get("/", result_controller_1.ResultController.getAllResults);
exports.ResultRoutes = router;
