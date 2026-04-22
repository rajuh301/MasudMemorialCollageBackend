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
exports.AttendanceService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
// 1. Register teacher face descriptor
const registerFaceIntoDB = (teacherId, descriptor) => __awaiter(void 0, void 0, void 0, function* () {
    // চেক করুন টিচার আছে কি না
    const teacher = yield prisma_1.default.teacher.findUnique({
        where: { id: teacherId, isDeleted: false },
    });
    if (!teacher) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found with this ID!");
    }
    // ডাটাবেজে আপডেট
    return yield prisma_1.default.teacher.update({
        where: { id: teacherId },
        data: {
            faceDescriptor: descriptor // সরাসরি অ্যারে পাঠানো যাবে
        },
        select: {
            id: true,
            name: true,
            email: true
        },
    });
});
// 2. Get all teachers with face descriptors
const getAllTeachersWithDescriptors = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.teacher.findMany({
        where: {
            isDeleted: false,
            // Change isEmpty to a standard array check to avoid 500 errors
            NOT: {
                faceDescriptor: {
                    equals: []
                }
            },
        },
        select: { id: true, name: true, faceDescriptor: true },
    });
});
// 3. Mark attendance by face (teacherId resolved on frontend after face match)
const createAttendanceIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherId } = req.body;
    const teacher = yield prisma_1.default.teacher.findUnique({
        where: { id: teacherId, isDeleted: false },
    });
    if (!teacher)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher not found");
    const now = new Date();
    // Set to start and end of current day in UTC/Server time
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    const existing = yield prisma_1.default.attendance.findFirst({
        where: {
            teacherId,
            date: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
    if (existing) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Attendance already marked for today!");
    }
    // Attendance Policy: LATE after 10:00 AM
    const currentHour = new Date().getHours();
    const status = currentHour >= 10 ? "LATE" : "PRESENT";
    return yield prisma_1.default.attendance.create({
        data: {
            teacherId,
            status,
            date: new Date(), // Actual capture time
        },
        include: {
            teacher: { select: { name: true, email: true } },
        },
    });
});
// 4. Admin: get ALL attendances (with optional date & teacher filters)
const getAttendancesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { teacherId, date } = query;
    const filters = {};
    if (teacherId) {
        filters.teacherId = teacherId;
    }
    if (date) {
        const day = new Date(date);
        const start = new Date(day);
        start.setHours(0, 0, 0, 0);
        const end = new Date(day);
        end.setHours(23, 59, 59, 999);
        filters.date = { gte: start, lte: end };
    }
    return yield prisma_1.default.attendance.findMany({
        where: filters,
        orderBy: { date: "desc" },
        include: {
            teacher: {
                select: { id: true, name: true, email: true, profilePhoto: true },
            },
        },
    });
});
// 5. Teacher: get their OWN attendances
const getMyAttendancesFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find teacher by userId (from JWT)
    const teacher = yield prisma_1.default.teacher.findUnique({
        where: { userId, isDeleted: false },
    });
    if (!teacher)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Teacher profile not found");
    return yield prisma_1.default.attendance.findMany({
        where: { teacherId: teacher.id },
        orderBy: { date: "desc" },
        select: {
            id: true,
            date: true,
            status: true,
            createdAt: true,
        },
    });
});
exports.AttendanceService = {
    registerFaceIntoDB,
    getAllTeachersWithDescriptors,
    createAttendanceIntoDB,
    getAttendancesFromDB,
    getMyAttendancesFromDB,
};
