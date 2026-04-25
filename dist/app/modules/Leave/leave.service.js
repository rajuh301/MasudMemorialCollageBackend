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
exports.LeaveService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// ─── Apply Leave ─────────────────────────────────────────────────────────────
const applyLeaveIntoDB = (authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, reason } = payload;
    let leaveData = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
    };
    // Attach applicant based on role
    if (authUser.role === client_1.UserRole.STUDENT) {
        const student = yield prisma_1.default.student.findFirst({
            where: { userId: authUser.id, isDeleted: false },
        });
        if (!student)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
        leaveData.studentId = student.id;
    }
    else if (authUser.role === client_1.UserRole.TEACHER) {
        const teacher = yield prisma_1.default.teacher.findFirst({
            where: { userId: authUser.id, isDeleted: false },
        });
        if (!teacher)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found");
        leaveData.teacherId = teacher.id;
    }
    else if (authUser.role === client_1.UserRole.OFFICESTAFF) {
        const officeStaff = yield prisma_1.default.officeStaff.findFirst({
            where: { userId: authUser.id, isDeleted: false },
        });
        if (!officeStaff)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Office staff not found");
        leaveData.officeStaffId = officeStaff.id;
    }
    const result = yield prisma_1.default.leave.create({ data: leaveData });
    return result;
});
// ─── Get All Leaves (Admin) ───────────────────────────────────────────────────
const getAllLeavesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, page = 1, limit = 10 } = query;
    const where = {};
    if (status) {
        where.status = status;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = yield Promise.all([
        prisma_1.default.leave.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy: { createdAt: "desc" },
            include: {
                student: { select: { id: true, name: true, email: true } },
                teacher: { select: { id: true, name: true, email: true } },
                officeStaff: { select: { id: true, name: true, email: true } },
                approvedBy: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma_1.default.leave.count({ where }),
    ]);
    return {
        meta: { page: Number(page), limit: Number(limit), total },
        data,
    };
});
// ─── Get My Leaves ────────────────────────────────────────────────────────────
const getMyLeavesFromDB = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    let where = {};
    if (authUser.role === client_1.UserRole.STUDENT) {
        const student = yield prisma_1.default.student.findFirst({
            where: { userId: authUser.id },
        });
        if (!student)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Student not found");
        where.studentId = student.id;
    }
    else if (authUser.role === client_1.UserRole.TEACHER) {
        const teacher = yield prisma_1.default.teacher.findFirst({
            where: { userId: authUser.id },
        });
        if (!teacher)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found");
        where.teacherId = teacher.id;
    }
    else if (authUser.role === client_1.UserRole.OFFICESTAFF) {
        const officeStaff = yield prisma_1.default.officeStaff.findFirst({
            where: { userId: authUser.id },
        });
        if (!officeStaff)
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Office staff not found");
        where.officeStaffId = officeStaff.id;
    }
    const result = yield prisma_1.default.leave.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
            approvedBy: { select: { id: true, name: true } },
        },
    });
    return result;
});
// ─── Get Single Leave ─────────────────────────────────────────────────────────
const getSingleLeaveFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.leave.findUnique({
        where: { id },
        include: {
            student: { select: { id: true, name: true, email: true } },
            teacher: { select: { id: true, name: true, email: true } },
            officeStaff: { select: { id: true, name: true, email: true } },
            approvedBy: { select: { id: true, name: true, email: true } },
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Leave application not found");
    }
    return result;
});
// ─── Update Leave Status (Admin) ──────────────────────────────────────────────
const updateLeaveStatusIntoDB = (id, authUser, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const leave = yield prisma_1.default.leave.findUnique({ where: { id } });
    if (!leave) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Leave application not found");
    }
    if (leave.status !== client_1.LeaveStatus.PENDING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Only pending leaves can be updated");
    }
    // Find admin record from userId
    const admin = yield prisma_1.default.admin.findFirst({
        where: { userId: authUser.id, isDeleted: false },
    });
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admin not found");
    }
    const result = yield prisma_1.default.leave.update({
        where: { id },
        data: {
            status: payload.status,
            adminNote: (_a = payload.adminNote) !== null && _a !== void 0 ? _a : null,
            approvedById: admin.id,
        },
    });
    return result;
});
// ─── Delete Leave ─────────────────────────────────────────────────────────────
const deleteLeaveFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const leave = yield prisma_1.default.leave.findUnique({ where: { id } });
    if (!leave) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Leave application not found");
    }
    const result = yield prisma_1.default.leave.delete({ where: { id } });
    return result;
});
exports.LeaveService = {
    applyLeaveIntoDB,
    getAllLeavesFromDB,
    getMyLeavesFromDB,
    getSingleLeaveFromDB,
    updateLeaveStatusIntoDB,
    deleteLeaveFromDB,
};
