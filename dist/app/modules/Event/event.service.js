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
exports.EventService = void 0;
const fileUploader_1 = require("../../../helpars/fileUploader");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createEventIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = yield fileUploader_1.fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary === null || uploadToCloudinary === void 0 ? void 0 : uploadToCloudinary.secure_url;
    }
    const result = yield prisma_1.default.event.create({
        data: Object.assign(Object.assign({}, req.body), { date: new Date(req.body.date) // convert user input
         })
    });
    return result;
});
const getEventFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getSingleEventFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.findUnique({
        where: { id },
    });
    return result;
});
const updateEventIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingEvent = yield prisma_1.default.event.findFirst({
        where: { id,
            isDeleted: false
        },
    });
    if (!existingEvent) {
        throw new Error("Event not found or already deleted");
    }
    const result = yield prisma_1.default.event.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteEventFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.event.update({
        where: { id },
        data: { isDeleted: true },
    });
    return result;
});
exports.EventService = {
    createEventIntoDB,
    getEventFromDB,
    getSingleEventFromDB,
    updateEventIntoDB,
    deleteEventFromDB,
};
