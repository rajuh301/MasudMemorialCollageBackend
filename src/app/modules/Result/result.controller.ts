import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ResultService } from "./result.service";

// Create Result
const createResult = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.createResultIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Result created successfully",
    data: result,
  });
});

// Get Student Result
const getStudentResult = catchAsync(async (req: Request, res: Response) => {
  const { roll, departmentId } = req.query;

  const result = await ResultService.getStudentResultFromDB(
    roll as string,
    departmentId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student result fetched successfully",
    data: result,
  });
});

// Latest results
const getLatestResults = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.getLatestResultsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Latest results fetched successfully",
    data: result,
  });
});

// All results
const getAllResults = catchAsync(async (req: Request, res: Response) => {
  const result = await ResultService.getAllResultsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All results fetched successfully",
    data: result,
  });
});

export const ResultController = {
  createResult,
  getStudentResult,
  getLatestResults,
  getAllResults,
};