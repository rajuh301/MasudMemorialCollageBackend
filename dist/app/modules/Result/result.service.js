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
exports.ResultService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createResultIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentRoll, departmentId, examType, subjects } = payload;
    // 1️⃣ Fetch student name from Student table using studentRoll
    const student = yield prisma_1.default.studentAdmission.findUnique({
        where: {
            studentRoll: studentRoll // Or adjust if you store roll differently
        },
        select: {
            firstName: true,
            lastName: true
        }
    });
    if (!student) {
        throw new Error("Student not found with this roll number");
    }
    const studentName = student.firstName;
    // 2️⃣ Create multiple result rows
    const result = yield prisma_1.default.result.createMany({
        data: subjects.map((sub) => ({
            studentRoll,
            studentName,
            departmentId,
            subject: sub.subject,
            marks: sub.marks,
            grade: sub.grade,
            examType,
        })),
        skipDuplicates: true,
    });
    return result;
});
const getStudentResultFromDB = (roll, departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.result.findMany({
        where: {
            studentRoll: roll,
            departmentId: departmentId,
        },
        include: {
            department: true,
        },
    });
});
const getLatestResultsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.result.findMany({
        include: {
            department: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    });
});
const getAllResultsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.result.findMany({
        include: { department: true },
        orderBy: { createdAt: "desc" },
    });
});
// ✅ Export ONE service object with all functions
exports.ResultService = {
    createResultIntoDB,
    getStudentResultFromDB,
    getLatestResultsFromDB,
    getAllResultsFromDB,
};
