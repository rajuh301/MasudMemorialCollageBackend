"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
router.post("/create-student-admission", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body.data ? JSON.parse(req.body.data) : req.body;
        const validatedData = studentAdmission_validation_1.createStudentAdmissionValidation.parse(data);
        req.body = validatedData;
        return studentAdmission_controller_1.studentController.createStudentAdmission(req, res, next);
    }
    catch (error) {
        next(error);
    }
}));
exports.StudentAdmissionRoutes = router;
