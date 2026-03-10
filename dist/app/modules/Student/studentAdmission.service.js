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
const createStudentAdmissionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = req.body;
    let imageUrl = body.image;
    if (file) {
        const uploaded = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        imageUrl = uploaded === null || uploaded === void 0 ? void 0 : uploaded.secure_url;
    }
    // Prepare the data for Prisma
    const data = {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.gender,
        bloodGroup: body.bloodGroup,
        maritalStatus: body.maritalStatus,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        guardianName: body.guardianName,
        guardianPhone: body.guardianPhone,
        guardianRelation: body.guardianRelation,
        previousSchool: body.previousSchool,
        previousGPA: body.previousGPA ? parseFloat(body.previousGPA) : null,
        passingYear: body.passingYear ? parseInt(body.passingYear) : null,
        subjects: Array.isArray(body.subjects) ? body.subjects : JSON.parse(body.subjects || '[]'),
        admissionFee: body.admissionFee ? parseFloat(body.admissionFee) : null,
        paymentStatus: body.paymentStatus || "UNPAID",
        image: imageUrl,
        department: {
            connect: { id: body.departmentId }
        }
    };
    // Add email if provided
    if (body.email) {
        data.email = body.email;
    }
    const result = yield prisma_1.default.studentAdmission.create({
        data,
        include: {
            department: true
        }
    });
    return result;
});
exports.createStudentAdmissionIntoDB = createStudentAdmissionIntoDB;
exports.StudentAdmissionService = {
    createStudentAdmissionIntoDB: exports.createStudentAdmissionIntoDB
};
