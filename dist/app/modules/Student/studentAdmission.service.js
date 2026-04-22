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
exports.StudentAdmissionService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createStudentAdmissionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const file = req.file;
    let imageUrl = null;
    if (file) {
        imageUrl = file.path;
    }
    // find last student roll
    const lastStudent = yield prisma_1.default.studentAdmission.findFirst({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            studentRoll: true,
        },
    });
    let newRoll = "001";
    if (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.studentRoll) {
        const lastRollNumber = parseInt(lastStudent.studentRoll);
        newRoll = String(lastRollNumber + 1).padStart(3, "0");
    }
    const result = yield prisma_1.default.studentAdmission.create({
        data: {
            studentRoll: newRoll,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
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
            previousGPA: body.previousGPA,
            passingYear: body.passingYear,
            subjects: body.subjects,
            admissionFee: body.admissionFee,
            paymentStatus: body.paymentStatus || "UNPAID",
            image: imageUrl,
            departmentId: body.departmentId,
        },
        include: {
            department: true,
        },
    });
    return result;
});
exports.StudentAdmissionService = {
    createStudentAdmissionIntoDB,
};
