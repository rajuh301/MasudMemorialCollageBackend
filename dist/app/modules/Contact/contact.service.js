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
exports.ContactService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createContactIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contact.create({
        data: payload,
    });
    return result;
});
const getContactsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contact.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return result;
});
const getSingleContactFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield prisma_1.default.contact.findUnique({
        where: {
            id,
        },
    });
    if (!contact) {
        throw new Error("Contact not found");
    }
    return contact;
});
const deleteContactFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.contact.delete({
        where: {
            id,
        },
    });
    return result;
});
exports.ContactService = {
    createContactIntoDB,
    getContactsFromDB,
    getSingleContactFromDB,
    deleteContactFromDB,
};
