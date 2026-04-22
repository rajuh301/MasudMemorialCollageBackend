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
exports.AccountService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createTransactionIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.transaction.create({
        data,
    });
    return result;
});
const getAccountStatementFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { startDate, endDate, type, category } = query;
    const whereConditions = {};
    if (type)
        whereConditions.type = type;
    if (category)
        whereConditions.category = category;
    if (startDate && endDate) {
        whereConditions.date = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }
    const transactions = yield prisma_1.default.transaction.findMany({
        where: whereConditions,
        orderBy: { date: "desc" },
    });
    // Calculate Summaries
    const summary = transactions.reduce((acc, item) => {
        if (item.type === "CASH_IN")
            acc.totalCashIn += item.amount;
        if (item.type === "CASH_OUT")
            acc.totalCashOut += item.amount;
        return acc;
    }, { totalCashIn: 0, totalCashOut: 0 });
    return {
        transactions,
        summary: Object.assign(Object.assign({}, summary), { balance: summary.totalCashIn - summary.totalCashOut }),
    };
});
exports.AccountService = {
    createTransactionIntoDB,
    getAccountStatementFromDB,
};
