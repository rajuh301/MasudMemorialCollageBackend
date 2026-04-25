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
    const { studentRoll, departmentId, examType, academicYear, subjects } = payload; // ✅ added academicYear
    // 1️⃣ Fetch student from StudentAdmission table
    const student = yield prisma_1.default.studentAdmission.findUnique({
        where: {
            studentRoll: studentRoll,
        },
        select: {
            firstName: true,
            lastName: true,
        },
    });
    if (!student) {
        throw new Error("Student not found with this roll number");
    }
    // 2️⃣ Create multiple result rows
    const result = yield prisma_1.default.result.createMany({
        data: subjects.map((sub) => ({
            studentRoll,
            departmentId,
            subject: sub.subject,
            marks: sub.marks,
            grade: sub.grade,
            examType,
            academicYear, // ✅ added academicYear
        })),
        skipDuplicates: true,
    });
    return result;
});
const getStudentResultFromDB = (roll, departmentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const results = yield prisma_1.default.result.findMany({
        where: {
            studentRoll: roll,
            departmentId: departmentId,
        },
        include: { department: true },
        orderBy: { createdAt: "desc" },
    });
    if (!results.length)
        throw new Error("No result found for this student");
    // ✅ Group by examType + academicYear
    const grouped = {};
    for (const r of results) {
        const key = `${r.examType}_${r.academicYear}`;
        if (!grouped[key]) {
            grouped[key] = {
                exam: r.examType,
                department: ((_a = r.department) === null || _a === void 0 ? void 0 : _a.name) || "N/A",
                year: r.academicYear,
                subjects: [],
            };
        }
        grouped[key].subjects.push({
            subject: r.subject,
            marks: r.marks,
            grade: r.grade,
        });
    }
    // ✅ Final clean response
    return Object.values(grouped).map((item) => ({
        exam: item.exam,
        department: item.department,
        year: item.year,
        subjects: item.subjects,
    }));
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
        select: {
            id: true,
            studentRoll: true,
            subject: true,
            marks: true,
            grade: true,
            examType: true,
            academicYear: true,
            createdAt: true,
            department: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: { createdAt: "desc" },
    });
});
// ✅ Grade priority list
const gradeOrder = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
const getOverallGrade = (grades) => {
    if (grades.includes("F"))
        return "F"; // যেকোনো F মানেই overall F
    for (const g of gradeOrder) {
        if (grades.includes(g))
            return g; // সবচেয়ে ভালো grade
    }
    return "N/A";
};
const getPublicResultFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const results = yield prisma_1.default.result.findMany({
        include: { department: true },
        orderBy: { createdAt: "desc" },
    });
    // ✅ Collect all unique student rolls (no repeated DB calls)
    const uniqueRolls = [...new Set(results.map((r) => r.studentRoll))];
    // ✅ Fetch all students at once (single DB call)
    const students = yield prisma_1.default.studentAdmission.findMany({
        where: { studentRoll: { in: uniqueRolls } },
        select: { studentRoll: true, firstName: true, lastName: true },
    });
    // ✅ Map for quick lookup
    const studentMap = {};
    for (const s of students) {
        studentMap[s.studentRoll] = `${s.firstName} ${s.lastName}`;
    }
    // ✅ Group by studentRoll + examType + academicYear
    const grouped = {};
    for (const r of results) {
        const key = `${r.studentRoll}_${r.examType}_${r.academicYear}`;
        if (!grouped[key]) {
            grouped[key] = {
                roll: r.studentRoll,
                name: studentMap[r.studentRoll] || "Unknown",
                exam: r.examType,
                department: ((_a = r.department) === null || _a === void 0 ? void 0 : _a.name) || "N/A",
                year: r.academicYear,
                grades: [],
            };
        }
        grouped[key].grades.push(r.grade);
    }
    // ✅ Final clean response
    return Object.values(grouped).map((item) => ({
        roll: item.roll,
        name: item.name,
        exam: item.exam,
        department: item.department,
        year: item.year,
        grade: getOverallGrade(item.grades), // একটাই overall grade
    }));
});
const getResultRecordsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.result.findMany({
        include: { department: true },
        orderBy: { createdAt: "desc" },
    });
});
const deleteResult = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.result.delete({
        where: {
            id,
        },
    });
});
exports.ResultService = {
    createResultIntoDB,
    getStudentResultFromDB,
    getLatestResultsFromDB,
    getAllResultsFromDB,
    getPublicResultFromDB,
    getResultRecordsFromDB,
    deleteResult
};
