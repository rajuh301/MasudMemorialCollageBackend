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
exports.StudentsCommentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpars/fileUploader");
// Allowed fields for update
const allowedFields = ["name", "description", "batch", "image"];
const createStudentsCommentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.studentsComment.create({
        data: req.body
    });
    return result;
});
// Get all comments
const getStudentsCommentFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studentsComment.findMany({
        orderBy: { createdAt: "desc" },
    });
    return result;
});
// Get single comment
const getSingleStudentsCommentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield prisma_1.default.studentsComment.findUnique({
        where: { id },
    });
    if (!comment) {
        throw new Error("Student comment not found");
    }
    return comment;
});
// Update comment
const updateStudentsCommentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Filter allowed fields
    const dataToUpdate = {};
    for (const key of Object.keys(payload)) {
        if (allowedFields.includes(key)) {
            dataToUpdate[key] = payload[key];
        }
        else {
            throw new Error(`Field "${key}" is not valid for Student Comment`);
        }
    }
    const existingComment = yield prisma_1.default.studentsComment.findUnique({
        where: { id },
    });
    if (!existingComment) {
        throw new Error("Student comment not found");
    }
    const result = yield prisma_1.default.studentsComment.update({
        where: { id },
        data: dataToUpdate,
    });
    return result;
});
// Delete comment
const deleteStudentsCommentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingComment = yield prisma_1.default.studentsComment.findUnique({
        where: { id },
    });
    if (!existingComment) {
        throw new Error("Student comment not found");
    }
    const result = yield prisma_1.default.studentsComment.delete({
        where: { id },
    });
    return result;
});
exports.StudentsCommentService = {
    createStudentsCommentIntoDB,
    getStudentsCommentFromDB,
    getSingleStudentsCommentFromDB,
    updateStudentsCommentIntoDB,
    deleteStudentsCommentFromDB,
};
