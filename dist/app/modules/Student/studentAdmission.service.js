"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentAdmissionService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// ─── Helper: dateOfBirth → "DD/MM/YYYY" default password ─────────────────────
// e.g. new Date("2006-10-10") → "10/10/2006"
const buildDefaultPassword = (dateOfBirth) => {
    const dd = String(dateOfBirth.getDate()).padStart(2, "0");
    const mm = String(dateOfBirth.getMonth() + 1).padStart(2, "0");
    const yyyy = dateOfBirth.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
};
// ─── Create Student Admission ─────────────────────────────────────────────────
const createStudentAdmissionIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const file = req.file;
    let imageUrl = null;
    if (file) {
        imageUrl = file.path;
    }
    // ── Auto-generate student roll ─────────────────────────────────────────────
    const lastStudent = yield prisma_1.default.studentAdmission.findFirst({
        orderBy: { createdAt: "desc" },
        select: { studentRoll: true },
    });
    let newRoll = "001";
    if (lastStudent === null || lastStudent === void 0 ? void 0 : lastStudent.studentRoll) {
        const lastRollNumber = parseInt(lastStudent.studentRoll);
        newRoll = String(lastRollNumber + 1).padStart(3, "0");
    }
    // ── Build default password from dateOfBirth (same pattern as createAdmin) ──
    const dateOfBirth = new Date(body.dateOfBirth);
    const defaultPassword = buildDefaultPassword(dateOfBirth); // "10/10/2006"
    const hashedPassword = yield bcrypt.hash(defaultPassword, 12);
    // ── Student login email ────────────────────────────────────────────────────
    const loginEmail = body.email || `${newRoll}@student.mmc.edu`;
    // ── Run everything in a transaction (same pattern as createAdmin) ──────────
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Check email not already taken
        const existingUser = yield transactionClient.user.findUnique({
            where: { email: loginEmail },
        });
        if (existingUser) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, "A user with this email already exists");
        }
        // 1️⃣ Create User (same structure as createAdmin/createTeacher)
        const createdUser = yield transactionClient.user.create({
            data: {
                email: loginEmail,
                password: hashedPassword,
                role: client_1.UserRole.STUDENT,
                needPasswordChange: true, // Force password change on first login
                status: client_1.UserStatus.ACTIVE,
                contactNumber: body.phone,
            },
        });
        // 2️⃣ Create StudentAdmission linked to User
        const createdAdmission = yield transactionClient.studentAdmission.create({
            data: {
                studentRoll: newRoll,
                firstName: body.firstName,
                lastName: body.lastName,
                email: loginEmail,
                phone: body.phone,
                dateOfBirth,
                gender: body.gender,
                bloodGroup: body.bloodGroup,
                maritalStatus: body.maritalStatus,
                presentAddress: body.presentAddress,
                permanentAddress: body.permanentAddress,
                guardianName: body.guardianName,
                guardianPhone: body.guardianPhone,
                guardianRelation: body.guardianRelation,
                previousSchool: body.previousSchool,
                previousGPA: parseFloat(body.previousGPA),
                passingYear: parseInt(body.passingYear),
                subjects: body.subjects,
                admissionFee: body.admissionFee ? parseFloat(body.admissionFee) : null,
                paymentStatus: body.paymentStatus || client_1.PaymentStatus.UNPAID,
                image: imageUrl,
                departmentId: body.departmentId,
                userId: createdUser.id,
            },
            include: { department: true },
        });
        // 3️⃣ Create Student record (for leave, attendance etc.)
        yield transactionClient.student.create({
            data: {
                name: `${body.firstName} ${body.lastName}`,
                email: loginEmail,
                phone: body.phone,
                profilePhoto: imageUrl,
                isPasswordChange: false,
                userId: createdUser.id,
            },
        });
        return {
            admission: createdAdmission,
            loginCredentials: {
                email: loginEmail,
                defaultPassword, // Plain text — admin shares this with student once
                note: "Student must change password on first login",
            },
        };
    }));
    return result;
});
// ─── Change Password (First Login & Thereafter) ───────────────────────────────
const changeStudentPassword = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: { id: authUser.id },
    });
    // Verify old password (same bcrypt.compare pattern)
    const isOldPasswordCorrect = yield bcrypt.compare(payload.oldPassword, user.password);
    if (!isOldPasswordCorrect) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect");
    }
    const hashedNewPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // Update User — mark needPasswordChange false
        yield transactionClient.user.update({
            where: { id: user.id },
            data: {
                password: hashedNewPassword,
                needPasswordChange: false,
            },
        });
        // Update Student — mark isPasswordChange true
        yield transactionClient.student.update({
            where: { userId: user.id },
            data: { isPasswordChange: true },
        });
    }));
    return { message: "Password changed successfully" };
});
// ─── Get All Admissions ───────────────────────────────────────────────────────
const getAllStudentAdmissionsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, departmentId, gender, paymentStatus } = query;
    const where = { isDeleted: false };
    if (departmentId)
        where.departmentId = departmentId;
    if (gender)
        where.gender = gender;
    if (paymentStatus)
        where.paymentStatus = paymentStatus;
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = yield Promise.all([
        prisma_1.default.studentAdmission.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: "desc" },
            include: { department: true },
        }),
        prisma_1.default.studentAdmission.count({ where }),
    ]);
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data,
    };
});
// ─── Get Single Admission ─────────────────────────────────────────────────────
const getSingleStudentAdmissionFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studentAdmission.findUnique({
        where: { id },
        include: { department: true },
    });
    if (!result || result.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student admission not found");
    }
    return result;
});
// ─── Update Admission ─────────────────────────────────────────────────────────
const updateStudentAdmissionIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const body = req.body;
    const admission = yield prisma_1.default.studentAdmission.findUnique({ where: { id } });
    if (!admission || admission.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student admission not found");
    }
    const updateData = Object.assign({}, body);
    if (file)
        updateData.image = file.path;
    if (body.dateOfBirth)
        updateData.dateOfBirth = new Date(body.dateOfBirth);
    if (body.previousGPA)
        updateData.previousGPA = parseFloat(body.previousGPA);
    if (body.passingYear)
        updateData.passingYear = parseInt(body.passingYear);
    if (body.admissionFee)
        updateData.admissionFee = parseFloat(body.admissionFee);
    const { data, id: bodyId } = updateData, sanitizedData = __rest(updateData, ["data", "id"]);
    const result = yield prisma_1.default.studentAdmission.update({
        where: { id },
        data: sanitizedData,
        include: { department: true },
    });
    return result;
});
// ─── Delete Admission (Soft) ──────────────────────────────────────────────────
const deleteStudentAdmissionFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admission = yield prisma_1.default.studentAdmission.findUnique({ where: { id } });
    if (!admission || admission.isDeleted) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student admission not found");
    }
    const result = yield prisma_1.default.studentAdmission.update({
        where: { id },
        data: { isDeleted: true },
    });
    return result;
});
exports.StudentAdmissionService = {
    createStudentAdmissionIntoDB,
    changeStudentPassword,
    getAllStudentAdmissionsFromDB,
    getSingleStudentAdmissionFromDB,
    updateStudentAdmissionIntoDB,
    deleteStudentAdmissionFromDB,
};
