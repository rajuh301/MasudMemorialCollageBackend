import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { SubBannerService } from "./subbanner.service";


const createSubBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await SubBannerService.createSubBannerIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sub Banner created successfully",
    data: result,
  });
});

const getSubBanner = catchAsync(async (req: Request, res: Response) => {
  const result = await SubBannerService.getSubBannerFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub Banner fetched successfully",
    data: result,
  });
});

const getSingleSubBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SubBannerService.getSingleSubBannerFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub Banner fetched successfully",
    data: result,
  });
});

const updateSubBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await SubBannerService.updateSubBannerIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub Banner updated successfully",
    data: result,
  });
});

const deleteSubBanner = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await SubBannerService.deleteSubBannerFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub Banner deleted successfully",
    data: result,
  });
});

export const SubBannerController = {
  createSubBanner,
  getSubBanner,
  getSingleSubBanner,
  updateSubBanner,
  deleteSubBanner,
};