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
exports.BannerService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createBannerIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.banner.create({
        data: req.body
    });
    return result;
});
const getBannerFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.banner.findMany({
        where: {
            isDeleted: false,
        },
    });
    return result;
});
const getSingleBannerFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.banner.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!result) {
        throw new Error("Banner not found");
    }
    return result;
});
const updateBannerIntoDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield prisma_1.default.banner.findFirst({
        where: {
            id: id,
            isDeleted: false,
        },
    });
    if (!banner) {
        throw new Error("Banner not found");
    }
    const result = yield prisma_1.default.banner.update({
        where: {
            id: banner.id,
        },
        data: data,
    });
    return result;
});
const deleteBannerFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const banner = yield prisma_1.default.banner.findFirst({
        where: {
            id: id,
        },
    });
    if (!banner) {
        throw new Error("Banner not found");
    }
    const result = yield prisma_1.default.banner.update({
        where: {
            id: banner.id,
        },
        data: {
            isDeleted: true,
        },
    });
    return result;
});
exports.BannerService = {
    createBannerIntoDB,
    getBannerFromDB,
    updateBannerIntoDB,
    deleteBannerFromDB,
    getSingleBannerFromDB
};
