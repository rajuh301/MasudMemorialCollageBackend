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
exports.StudentsCommentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
// Allowed fields for update
const allowedFields = ["name", "description", "batch", "image"];
const createStudentsCommentIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        req.body.image = file.path;
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
const updateStudentsCommentIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // 1. Check existence
    const existingComment = yield prisma_1.default.studentsComment.findUnique({
        where: { id },
    });
    if (!existingComment) {
        throw new Error("Student comment not found");
    }
    // 2. Prepare payload
    const updateData = Object.assign({}, req.body);
    if (file) {
        updateData.image = file.path;
    }
    // 3. SANITIZE: Remove any non-schema fields
    // This removes "data", "id", or anything else passed in req.body
    const { data, id: bodyId, file: fileKey } = updateData, sanitizedData = __rest(updateData, ["data", "id", "file"]);
    const result = yield prisma_1.default.studentsComment.update({
        where: { id },
        data: sanitizedData,
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
