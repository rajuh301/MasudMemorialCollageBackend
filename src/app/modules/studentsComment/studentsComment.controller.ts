import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { StudentsCommentService } from "./studentsComment.service";

const createStudentsComment = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentsCommentService.createStudentsCommentIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Student comment created successfully",
    data: result,
  });
});

const getStudentsComment = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentsCommentService.getStudentsCommentFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student comments fetched successfully",
    data: result,
  });
});

const getSingleStudentsComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentsCommentService.getSingleStudentsCommentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student comment fetched successfully",
    data: result,
  });
});

const updateStudentsComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const result = await StudentsCommentService.updateStudentsCommentIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student comment updated successfully",
    data: result,
  });
});

const deleteStudentsComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentsCommentService.deleteStudentsCommentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student comment deleted successfully",
    data: result,
  });
});

export const StudentsCommentController = {
  createStudentsComment,
  getStudentsComment,
  getSingleStudentsComment,
  updateStudentsComment,
  deleteStudentsComment,
};