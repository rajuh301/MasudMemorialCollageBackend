import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { StudentAdmissionService } from "./studentAdmission.service";
import sendResponse from "../../../shared/sendResponse";

export const createStudentAdmission = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentAdmissionService.createStudentAdmissionIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student admission created successfully",
    data: result,
  });
});

export const studentController = {
  createStudentAdmission
};