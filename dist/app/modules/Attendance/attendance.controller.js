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
exports.AttendanceController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const attendance_service_1 = require("./attendance.service");
// 1. Register teacher face
const registerFace = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { descriptor } = req.body;
    const result = yield attendance_service_1.AttendanceService.registerFaceIntoDB(id, descriptor);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Face descriptor updated successfully",
        data: result,
    });
}));
// 2. Get all teachers with descriptors (for face scanner)
const getAllTeachersWithDescriptors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield attendance_service_1.AttendanceService.getAllTeachersWithDescriptors();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Teachers with face descriptors fetched successfully",
        data: result,
    });
}));
// 3. Mark attendance via face recognition
const createAttendance = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield attendance_service_1.AttendanceService.createAttendanceIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Attendance recorded successfully",
        data: result,
    });
}));
// 4. Admin: get ALL attendances
const getAllAttendances = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield attendance_service_1.AttendanceService.getAttendancesFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All attendances fetched successfully",
        data: result,
    });
}));
// 5. Teacher: get OWN attendances
const getMyAttendances = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // injected by auth middleware
    const result = yield attendance_service_1.AttendanceService.getMyAttendancesFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Your attendances fetched successfully",
        data: result,
    });
}));
exports.AttendanceController = {
    registerFace,
    getAllTeachersWithDescriptors,
    createAttendance,
    getAllAttendances,
    getMyAttendances,
};
