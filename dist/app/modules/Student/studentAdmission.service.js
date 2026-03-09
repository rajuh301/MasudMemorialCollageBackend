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
exports.StudentAdmissionService = exports.createStudentAdmissionIntoDB = void 0;
const fileUploader_1 = require("../../../helpars/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
;
const createStudentAdmissionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploaded = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
    }
    // Only include email if provided (avoid Prisma unique null errors)
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        dateOfBirth: new Date(req.body.dateOfBirth),
        gender: req.body.gender,
        bloodGroup: req.body.bloodGroup,
        maritalStatus: req.body.maritalStatus,
        presentAddress: req.body.presentAddress,
        permanentAddress: req.body.permanentAddress,
        guardianName: req.body.guardianName,
        guardianPhone: req.body.guardianPhone,
        guardianRelation: req.body.guardianRelation,
        previousSchool: req.body.previousSchool,
        previousGPA: req.body.previousGPA,
        passingYear: req.body.passingYear,
        subjects: req.body.subjects,
        admissionFee: req.body.admissionFee,
        paymentStatus: req.body.paymentStatus,
        image: req.body.image,
        department: { connect: { id: req.body.departmentId } }
    };
    if (req.body.email)
        data.email = req.body.email;
    const result = yield prisma_1.default.studentAdmission.create({ data });
    return result;
});
exports.createStudentAdmissionIntoDB = createStudentAdmissionIntoDB;
exports.StudentAdmissionService = {
    createStudentAdmissionIntoDB: exports.createStudentAdmissionIntoDB
};
