import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AccountService } from "./account.service";

const createTransaction = catchAsync(async (req: Request, res: Response) => {
    const result = await AccountService.createTransactionIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Transaction recorded successfully",
        data: result,
    });
});

const getAccountStatement = catchAsync(async (req: Request, res: Response) => {
    const result = await AccountService.getAccountStatementFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Account statement fetched successfully",
        data: result,
    });
});

export const AccountController = {
    createTransaction,
    getAccountStatement,
};