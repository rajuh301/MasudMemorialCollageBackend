import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StudentNoticeService } from "./studentNotice.service";

const createStudentNotice = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentNoticeService.createStudentNoticeIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Student notice created successfully",
        data: result,
    });
});

const getAllStudentNotices = catchAsync(async (req: Request, res: Response) => {
    const result = await StudentNoticeService.getAllStudentNoticesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student notices fetched successfully",
        data: result,
    });
});

const getSingleStudentNotice = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await StudentNoticeService.getSingleStudentNoticeFromDB(id);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Student notice fetched successfully",
            data: result,
        });
    }
);

const getNoticesByDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { departmentId } = req.params;

        const result =
            await StudentNoticeService.getNoticesByDepartmentFromDB(departmentId);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Department notices fetched successfully",
            data: result,
        });
    }
);

const getNoticesByStudentRoll = catchAsync(
    async (req: Request, res: Response) => {
        const { studentRoll } = req.params;

        const result =
            await StudentNoticeService.getNoticesByStudentRollFromDB(studentRoll);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Student roll notices fetched successfully",
            data: result,
        });
    }
);

const updateStudentNotice = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const result = await StudentNoticeService.updateStudentNoticeIntoDB(id, data);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student notice updated successfully",
        data: result,
    });
});

const deleteStudentNotice = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await StudentNoticeService.deleteStudentNoticeFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student notice deleted successfully",
        data: result,
    });
});


const ownNotice = catchAsync(async (req: Request, res: Response) => {

    const studentEmail = req.user?.email as string;

    const result = await StudentNoticeService.ownNotice(studentEmail);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student notice fetch successfully",
        data: result,
    });
})

export const StudentNoticeController = {
    createStudentNotice,
    getAllStudentNotices,
    getSingleStudentNotice,
    getNoticesByDepartment,
    getNoticesByStudentRoll,
    updateStudentNotice,
    deleteStudentNotice,
    ownNotice
};