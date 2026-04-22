import { LeaveStatus, UserRole } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

// ─── Apply Leave ─────────────────────────────────────────────────────────────

const applyLeaveIntoDB = async (authUser: any, payload: any) => {
  const { startDate, endDate, reason } = payload;

  let leaveData: any = {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    reason,
  };

  // Attach applicant based on role
  if (authUser.role === UserRole.STUDENT) {
    const student = await prisma.student.findFirst({
      where: { userId: authUser.id, isDeleted: false },
    });
    if (!student) throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
    leaveData.studentId = student.id;
  } else if (authUser.role === UserRole.TEACHER) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: authUser.id, isDeleted: false },
    });
    if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");
    leaveData.teacherId = teacher.id;
  } else if (authUser.role === UserRole.OFFICESTAFF) {
    const officeStaff = await prisma.officeStaff.findFirst({
      where: { userId: authUser.id, isDeleted: false },
    });
    if (!officeStaff)
      throw new ApiError(httpStatus.NOT_FOUND, "Office staff not found");
    leaveData.officeStaffId = officeStaff.id;
  }

  const result = await prisma.leave.create({ data: leaveData });
  return result;
};

// ─── Get All Leaves (Admin) ───────────────────────────────────────────────────

const getAllLeavesFromDB = async (query: any) => {
  const { status, page = 1, limit = 10 } = query;

  const where: any = {};
  if (status) {
    where.status = status as LeaveStatus;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    prisma.leave.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        teacher: { select: { id: true, name: true, email: true } },
        officeStaff: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.leave.count({ where }),
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data,
  };
};

// ─── Get My Leaves ────────────────────────────────────────────────────────────

const getMyLeavesFromDB = async (authUser: any) => {
  let where: any = {};

  if (authUser.role === UserRole.STUDENT) {
    const student = await prisma.student.findFirst({
      where: { userId: authUser.id },
    });
    if (!student) throw new ApiError(httpStatus.NOT_FOUND, "Student not found");
    where.studentId = student.id;
  } else if (authUser.role === UserRole.TEACHER) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId: authUser.id },
    });
    if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");
    where.teacherId = teacher.id;
  } else if (authUser.role === UserRole.OFFICESTAFF) {
    const officeStaff = await prisma.officeStaff.findFirst({
      where: { userId: authUser.id },
    });
    if (!officeStaff)
      throw new ApiError(httpStatus.NOT_FOUND, "Office staff not found");
    where.officeStaffId = officeStaff.id;
  }

  const result = await prisma.leave.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      approvedBy: { select: { id: true, name: true } },
    },
  });

  return result;
};

// ─── Get Single Leave ─────────────────────────────────────────────────────────

const getSingleLeaveFromDB = async (id: string) => {
  const result = await prisma.leave.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, email: true } },
      teacher: { select: { id: true, name: true, email: true } },
      officeStaff: { select: { id: true, name: true, email: true } },
      approvedBy: { select: { id: true, name: true, email: true } },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Leave application not found");
  }

  return result;
};

// ─── Update Leave Status (Admin) ──────────────────────────────────────────────

const updateLeaveStatusIntoDB = async (
  id: string,
  authUser: any,
  payload: { status: LeaveStatus; adminNote?: string }
) => {
  const leave = await prisma.leave.findUnique({ where: { id } });

  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, "Leave application not found");
  }

  if (leave.status !== LeaveStatus.PENDING) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Only pending leaves can be updated"
    );
  }

  // Find admin record from userId
  const admin = await prisma.admin.findFirst({
    where: { userId: authUser.id, isDeleted: false },
  });

  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  const result = await prisma.leave.update({
    where: { id },
    data: {
      status: payload.status,
      adminNote: payload.adminNote ?? null,
      approvedById: admin.id,
    },
  });

  return result;
};

// ─── Delete Leave ─────────────────────────────────────────────────────────────

const deleteLeaveFromDB = async (id: string) => {
  const leave = await prisma.leave.findUnique({ where: { id } });

  if (!leave) {
    throw new ApiError(httpStatus.NOT_FOUND, "Leave application not found");
  }

  const result = await prisma.leave.delete({ where: { id } });
  return result;
};

export const LeaveService = {
  applyLeaveIntoDB,
  getAllLeavesFromDB,
  getMyLeavesFromDB,
  getSingleLeaveFromDB,
  updateLeaveStatusIntoDB,
  deleteLeaveFromDB,
};