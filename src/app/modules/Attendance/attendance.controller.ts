import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AttendanceService } from "./attendance.service";

const createAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.createAttendanceIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attendance recorded successfully",
    data: result,
  });
});

const getAllAttendances = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.getAttendancesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Attendances fetched successfully",
    data: result,
  });
});

export const AttendanceController = {
  createAttendance,
  getAllAttendances
};