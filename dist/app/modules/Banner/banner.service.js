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
exports.BannerService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createBannerIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        req.body.image = file.path;
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
const updateBannerIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // 1. Verify existence
    const isExist = yield prisma_1.default.banner.findUnique({
        where: { id, isDeleted: false },
    });
    if (!isExist) {
        throw new Error("Banner not found or already deleted");
    }
    // 2. Extract validated data from req.body
    const updateData = Object.assign({}, req.body);
    // 3. Attach new image path if file exists
    if (file) {
        updateData.image = file.path;
    }
    // 4. Final safety: Remove any keys that aren't in the Banner Prisma Model
    // This prevents the "Unknown argument" error if 'data' or 'id' slipped through
    const { data, id: bodyId } = updateData, sanitizedData = __rest(updateData, ["data", "id"]);
    const result = yield prisma_1.default.banner.update({
        where: { id },
        data: sanitizedData,
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
