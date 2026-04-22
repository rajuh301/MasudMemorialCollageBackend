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
exports.EventService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createEventIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (file) {
        req.body.image = file.path;
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
const updateEventIntoDB = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const isExist = yield prisma_1.default.event.findUnique({
        where: { id, isDeleted: false },
    });
    if (!isExist) {
        throw new Error("Event not found or already deleted");
    }
    const updateData = Object.assign({}, req.body);
    if (file) {
        updateData.image = file.path;
    }
    // Handle Date conversion if date is being updated
    if (updateData.date) {
        updateData.date = new Date(updateData.date);
    }
    // Sanitize data to remove non-schema fields (like 'data' from Postman)
    const { data, id: bodyId } = updateData, sanitizedData = __rest(updateData, ["data", "id"]);
    const result = yield prisma_1.default.event.update({
        where: { id },
        data: sanitizedData,
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
