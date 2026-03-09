import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { OurTeachersService } from "./ourTeachers.service";

const createOurTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await OurTeachersService.createOurTeacherIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Teacher created successfully",
    data: result,
  });
});

const getOurTeachers = catchAsync(async (req: Request, res: Response) => {
  const result = await OurTeachersService.getOurTeachersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teachers fetched successfully",
    data: result,
  });
});

const getSingleOurTeacher = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OurTeachersService.getSingleOurTeacherFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teacher fetched successfully",
    data: result,
  });
});

const updateOurTeacher = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const result = await OurTeachersService.updateOurTeacherIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teacher updated successfully",
    data: result,
  });
});

const deleteOurTeacher = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await OurTeachersService.deleteOurTeacherFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Teacher deleted successfully",
    data: result,
  });
});

export const OurTeachersController = {
  createOurTeacher,
  getOurTeachers,
  getSingleOurTeacher,
  updateOurTeacher,
  deleteOurTeacher,
};