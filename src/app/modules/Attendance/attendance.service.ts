import { Request } from "express";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

// 1. Register teacher face descriptor
const registerFaceIntoDB = async (teacherId: string, descriptor: number[]) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId, isDeleted: false },
  });

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");

  return await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      // USE THIS SYNTAX FOR PRISMA ARRAYS
      faceDescriptor: {
        set: descriptor
      }
    },
    select: { id: true, name: true, email: true },
  });
};

// 2. Get all teachers with face descriptors
const getAllTeachersWithDescriptors = async () => {
  return await prisma.teacher.findMany({
    where: {
      isDeleted: false,
      // Change isEmpty to a standard array check to avoid 500 errors
      NOT: {
        faceDescriptor: {
          equals: []
        }
      },
    },
    select: { id: true, name: true, faceDescriptor: true },
  });
};


// 3. Mark attendance by face (teacherId resolved on frontend after face match)
const createAttendanceIntoDB = async (req: Request) => {
  const { teacherId } = req.body;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId, isDeleted: false },
  });

  if (!teacher) throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");

  const now = new Date();

  // Set to start and end of current day in UTC/Server time
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const existing = await prisma.attendance.findFirst({
    where: {
      teacherId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Attendance already marked for today!");
  }

  // Attendance Policy: LATE after 10:00 AM
  const currentHour = new Date().getHours();
  const status = currentHour >= 10 ? "LATE" : "PRESENT";

  return await prisma.attendance.create({
    data: {
      teacherId,
      status,
      date: new Date(), // Actual capture time
    },
    include: {
      teacher: { select: { name: true, email: true } },
    },
  });
};

// 4. Admin: get ALL attendances (with optional date & teacher filters)
const getAttendancesFromDB = async (query: Record<string, unknown>) => {
  const { teacherId, date } = query;

  const filters: Record<string, unknown> = {};

  if (teacherId) {
    filters.teacherId = teacherId as string;
  }

  if (date) {
    const day = new Date(date as string);
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(day);
    end.setHours(23, 59, 59, 999);
    filters.date = { gte: start, lte: end };
  }

  return await prisma.attendance.findMany({
    where: filters,
    orderBy: { date: "desc" },
    include: {
      teacher: {
        select: { id: true, name: true, email: true, profilePhoto: true },
      },
    },
  });
};

// 5. Teacher: get their OWN attendances
const getMyAttendancesFromDB = async (userId: string) => {
  // Find teacher by userId (from JWT)
  const teacher = await prisma.teacher.findUnique({
    where: { userId, isDeleted: false },
  });

  if (!teacher)
    throw new ApiError(httpStatus.NOT_FOUND, "Teacher profile not found");

  return await prisma.attendance.findMany({
    where: { teacherId: teacher.id },
    orderBy: { date: "desc" },
    select: {
      id: true,
      date: true,
      status: true,
      createdAt: true,
    },
  });
};

export const AttendanceService = {
  registerFaceIntoDB,
  getAllTeachersWithDescriptors,
  createAttendanceIntoDB,
  getAttendancesFromDB,
  getMyAttendancesFromDB,
};