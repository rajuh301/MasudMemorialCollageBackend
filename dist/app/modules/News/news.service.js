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
exports.NewsService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createNewsIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const result = yield prisma_1.default.news.create({
        data: {
            lable: data.lable,
            value: data.value,
        },
    });
    return result;
});
const getNewsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.news.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getSingleNewsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.news.findUnique({
        where: {
            id,
        },
    });
    return result;
});
const updateNewsIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.news.update({
        where: {
            id,
        },
        data,
    });
    return result;
});
const deleteNewsFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.news.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.NewsService = {
    createNewsIntoDB,
    getNewsFromDB,
    getSingleNewsFromDB,
    updateNewsIntoDB,
    deleteNewsFromDB,
};
