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


const getImportentNotic = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getImportentNotic();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Importent Notice fetched successfully",
    data: result,
  });
})

const getRecentNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getRecentNotice();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Recent Notice fetched successfully",
    data: result,
  });
});

const getAcademicNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getAcademicNotice();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Academic Notice fetched successfully",
    data: result,
  });
});

const getOfficalNotice = catchAsync(async (req: Request, res: Response) => {
  const result = await NoticeService.getOfficalNotice();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Offical Notice fetched successfully",
    data: result,
  });
});


export const NoticeController = {
  createNotice,
  getNotice,
  getSingleNotice,
  updateNotice,
  deleteNotice,
  getImportentNotic,
  getRecentNotice,
  getAcademicNotice,
  getOfficalNotice
};