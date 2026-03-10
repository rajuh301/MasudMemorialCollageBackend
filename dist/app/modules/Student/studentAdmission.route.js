"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAdmissionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const studentAdmission_validation_1 = require("./studentAdmission.validation");
const studentAdmission_controller_1 = require("./studentAdmission.controller");
const router = express_1.default.Router();
router.post("/create-student-admission", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    try {
        // Parse the data from form-data
        const data = req.body.data ? JSON.parse(req.body.data) : req.body;
        // Validate the data
        const validatedData = studentAdmission_validation_1.createStudentAdmissionValidation.parse(data);
        // Attach validated data to request body
        req.body = validatedData;
        // Call the controller
        return studentAdmission_controller_1.studentController.createStudentAdmission(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
exports.StudentAdmissionRoutes = router;
