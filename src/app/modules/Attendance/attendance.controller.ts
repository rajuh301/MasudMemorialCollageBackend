import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AttendanceService } from "./attendance.service";

// 1. Register teacher face
const registerFace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { descriptor } = req.body;

  // ব্যাকএন্ড লেভেলে এক্সট্রা চেক
  if (!id || id === "undefined") {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Valid Teacher ID is required in params"
    });
  }

  const result = await AttendanceService.registerFaceIntoDB(id, descriptor);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Face descriptor updated successfully",
    data: result,
  });
});

// 2. Get all teachers with descriptors (for face scanner)
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

// 3. Mark attendance via face recognition
const createAttendance = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.createAttendanceIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Attendance recorded successfully",
    data: result,
  });
});

// 4. Admin: get ALL attendances
const getAllAttendances = catchAsync(async (req: Request, res: Response) => {
  const result = await AttendanceService.getAttendancesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All attendances fetched successfully",
    data: result,
  });
});

// 5. Teacher: get OWN attendances
const getMyAttendances = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id; // injected by auth middleware

  const result = await AttendanceService.getMyAttendancesFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your attendances fetched successfully",
    data: result,
  });
});

export const AttendanceController = {
  registerFace,
  getAllTeachersWithDescriptors,
  createAttendance,
  getAllAttendances,
  getMyAttendances,
};