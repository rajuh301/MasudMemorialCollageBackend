import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { LeaveService } from "./leave.service";

const applyLeave = catchAsync(async (req: Request, res: Response) => {
  const user = req.user; // from auth middleware
  const result = await LeaveService.applyLeaveIntoDB(user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Leave application submitted successfully",
    data: result,
  });
});

const getAllLeaves = catchAsync(async (req: Request, res: Response) => {
  const result = await LeaveService.getAllLeavesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All leave applications fetched successfully",
    data: result,
  });
});

const getMyLeaves = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await LeaveService.getMyLeavesFromDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your leave applications fetched successfully",
    data: result,
  });
});

const getSingleLeave = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeaveService.getSingleLeaveFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leave application fetched successfully",
    data: result,
  });
});

const updateLeaveStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await LeaveService.updateLeaveStatusIntoDB(id, user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leave status updated successfully",
    data: result,
  });
});

const deleteLeave = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await LeaveService.deleteLeaveFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Leave application deleted successfully",
    data: result,
  });
});

export const LeaveController = {
  applyLeave,
  getAllLeaves,
  getMyLeaves,
  getSingleLeave,
  updateLeaveStatus,
  deleteLeave,
};