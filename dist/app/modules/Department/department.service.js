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
exports.DepartmentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createDepartmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.department.create({
        data: payload,
    });
    return result;
});
const getDepartmentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.department.findMany({
        orderBy: {
            name: "asc",
        },
    });
    return result;
});
const getSingleDepartmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield prisma_1.default.department.findUnique({
        where: {
            id,
        },
    });
    if (!department) {
        throw new Error("Department not found");
    }
    return department;
});
const updateDepartmentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.department.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteDepartmentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.department.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.DepartmentService = {
    createDepartmentIntoDB,
    getDepartmentsFromDB,
    getSingleDepartmentFromDB,
    updateDepartmentIntoDB,
    deleteDepartmentFromDB,
};
