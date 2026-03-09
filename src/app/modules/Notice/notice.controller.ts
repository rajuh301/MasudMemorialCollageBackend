import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { NoticeService } from "./notice.service";

const createNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.createNoticeIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notice created successfully",
    data: result,
  });
});

const getNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getNoticeFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice fetched successfully",
    data: result,
  });
});

const getSingleNotice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await NoticeService.getSingleNoticeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice fetched successfully",
    data: result,
  });
});

const updateNotice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await NoticeService.updateNoticeIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice updated successfully",
    data: result,
  });
});

const deleteNotice = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await NoticeService.deleteNoticeFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notice deleted successfully",
    data: result,
  });
});

export const NoticeController = {
  createNotice,
  getNotice,
  getSingleNotice,
  updateNotice,
  deleteNotice,
};