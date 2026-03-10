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
exports.OurTeachersService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const allowedFields = [
    "name",
    "position",
    "subject",
    "description",
    "rating",
];
const createOurTeacherIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.ourTeachers.create({
        data: req.body
    });
    return result;
});
const getOurTeachersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.ourTeachers.findMany({
        where: {
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getSingleOurTeacherFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = yield prisma_1.default.ourTeachers.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!teacher) {
        throw new Error("Teacher not found");
    }
    return teacher;
});
const updateOurTeacherIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const dataToUpdate = {};
    for (const key of Object.keys(payload)) {
        if (allowedFields.includes(key)) {
            dataToUpdate[key] = payload[key];
        }
        else {
            throw new Error(`Field "${key}" is not valid for Teacher`);
        }
    }
    const existingTeacher = yield prisma_1.default.ourTeachers.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingTeacher) {
        throw new Error("Teacher not found or already deleted");
    }
    const result = yield prisma_1.default.ourTeachers.update({
        where: { id },
        data: dataToUpdate,
    });
    return result;
});
const deleteOurTeacherFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTeacher = yield prisma_1.default.ourTeachers.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingTeacher) {
        throw new Error("Teacher not found or already deleted");
    }
    const result = yield prisma_1.default.ourTeachers.update({
        where: { id },
        data: { isDeleted: true },
    });
    return result;
});
exports.OurTeachersService = {
    createOurTeacherIntoDB,
    getOurTeachersFromDB,
    getSingleOurTeacherFromDB,
    updateOurTeacherIntoDB,
    deleteOurTeacherFromDB,
};
