import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StudentAdmissionService } from "./studentAdmission.service";

const createStudentAdmission = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentAdmissionService.createStudentAdmissionIntoDB(req);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Student admission created successfully",
      data: result,
    });
  }
);

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await StudentAdmissionService.changeStudentPassword(
    user,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getAllStudentAdmissions = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentAdmissionService.getAllStudentAdmissionsFromDB(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student admissions fetched successfully",
      data: result,
    });
  }
);

const getSingleStudentAdmission = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentAdmissionService.getSingleStudentAdmissionFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student admission fetched successfully",
      data: result,
    });
  }
);

const updateStudentAdmission = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentAdmissionService.updateStudentAdmissionIntoDB(id, req);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student admission updated successfully",
      data: result,
    });
  }
);

const deleteStudentAdmission = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentAdmissionService.deleteStudentAdmissionFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Student admission deleted successfully",
      data: result,
    });
  }
);

export const StudentAdmissionController = {
  createStudentAdmission,
  changePassword,
  getAllStudentAdmissions,
  getSingleStudentAdmission,
  updateStudentAdmission,
  deleteStudentAdmission,
};