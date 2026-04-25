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
exports.GovermentBodyService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createGovermentBodyIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        req.body.image = file.path;
    }
    const result = yield prisma_1.default.govermentBody.create({
        data: {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
        },
    });
    return result;
});
const getAllGovermentBodiesFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.govermentBody.findMany({
        orderBy: { name: "asc" },
    });
    return result;
});
const getSingleGovermentBodyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.govermentBody.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Government body not found");
    }
    return result;
});
const updateGovermentBodyIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const isExist = yield prisma_1.default.govermentBody.findUnique({ where: { id } });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Government body not found");
    }
    const updateData = Object.assign({}, req.body);
    if (file) {
        updateData.image = file.path;
    }
    // Remove any non-schema fields
    const { data, id: bodyId } = updateData, sanitizedData = __rest(updateData, ["data", "id"]);
    const result = yield prisma_1.default.govermentBody.update({
        where: { id },
        data: sanitizedData,
    });
    return result;
});
const deleteGovermentBodyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.govermentBody.findUnique({ where: { id } });
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Government body not found");
    }
    const result = yield prisma_1.default.govermentBody.delete({ where: { id } });
    return result;
});
exports.GovermentBodyService = {
    createGovermentBodyIntoDB,
    getAllGovermentBodiesFromDB,
    getSingleGovermentBodyFromDB,
    updateGovermentBodyIntoDB,
    deleteGovermentBodyFromDB,
};
