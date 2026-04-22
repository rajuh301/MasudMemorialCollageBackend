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
        req.body.image = file.path;
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
const updateOurTeacherIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // 1. Check if teacher exists
    const existingTeacher = yield prisma_1.default.ourTeachers.findUnique({
        where: { id, isDeleted: false },
    });
    if (!existingTeacher) {
        throw new Error("Teacher not found or already deleted");
    }
    // 2. Clone the body so we don't mutate the original request
    const updateData = Object.assign({}, req.body);
    // 3. Handle image if uploaded
    if (file) {
        updateData.image = file.path;
    }
    // 4. CLEANUP: Prisma will throw an error if "data", "file", or "id" 
    // are inside the data object. We must remove them.
    delete updateData.data;
    delete updateData.id;
    delete updateData.file;
    // 5. Execute Update
    const result = yield prisma_1.default.ourTeachers.update({
        where: { id },
        data: updateData, // This now contains name, position, subject, etc.
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
