import { Prisma, Transaction } from "@prisma/client";
import prisma from "../../../shared/prisma";

const createTransactionIntoDB = async (data: Transaction): Promise<Transaction> => {
    const result = await prisma.transaction.create({
        data,
    });
    return result;
};

const getAccountStatementFromDB = async (query: any) => {
    const { startDate, endDate, type, category } = query;

    const whereConditions: Prisma.TransactionWhereInput = {};

    if (type) whereConditions.type = type;
    if (category) whereConditions.category = category;
    if (startDate && endDate) {
        whereConditions.date = {
            gte: new Date(startDate),
            lte: new Date(endDate),
        };
    }

    const transactions = await prisma.transaction.findMany({
        where: whereConditions,
        orderBy: { date: "desc" },
    });

    // Calculate Summaries
    const summary = transactions.reduce(
        (acc, item) => {
            if (item.type === "CASH_IN") acc.totalCashIn += item.amount;
            if (item.type === "CASH_OUT") acc.totalCashOut += item.amount;
            return acc;
        },
        { totalCashIn: 0, totalCashOut: 0 }
    );

    return {
        transactions,
        summary: {
            ...summary,
            balance: summary.totalCashIn - summary.totalCashOut,
        },
    };
};

export const AccountService = {
    createTransactionIntoDB,
    getAccountStatementFromDB,
};