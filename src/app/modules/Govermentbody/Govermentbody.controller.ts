import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { GovermentBodyService } from "./Govermentbody.service";

const createGovermentBody = catchAsync(async (req: Request, res: Response) => {
  const result = await GovermentBodyService.createGovermentBodyIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Government body created successfully",
    data: result,
  });
});

const getAllGovermentBodies = catchAsync(
  async (req: Request, res: Response) => {
    const result = await GovermentBodyService.getAllGovermentBodiesFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Government bodies fetched successfully",
      data: result,
    });
  }
);

const getSingleGovermentBody = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await GovermentBodyService.getSingleGovermentBodyFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Government body fetched successfully",
      data: result,
    });
  }
);

const updateGovermentBody = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GovermentBodyService.updateGovermentBodyIntoDB(id, req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Government body updated successfully",
    data: result,
  });
});

const deleteGovermentBody = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await GovermentBodyService.deleteGovermentBodyFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Government body deleted successfully",
    data: result,
  });
});

export const GovermentBodyController = {
  createGovermentBody,
  getAllGovermentBodies,
  getSingleGovermentBody,
  updateGovermentBody,
  deleteGovermentBody,
};