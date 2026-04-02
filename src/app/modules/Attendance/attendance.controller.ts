import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AttendanceService } from "./attendance.service";





const registerFace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descriptor } = req.body;

  if (!descriptor || !Array.isArray(descriptor)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "descriptor must be a number array",
    });
  }

  const result = await AttendanceService.registerFaceIntoDB(id, descriptor);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Face registered successfully",
    data: result,
  });
});

const getAllTeachersWithDescriptors = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AttendanceService.getAllTeachersWithDescriptors();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Teachers with face descriptors fetched successfully",
      data: result,
    });
  }
);



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
  getAllAttendances,
  registerFace,
  getAllTeachersWithDescriptors
};