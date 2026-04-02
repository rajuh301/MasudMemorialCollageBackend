import { Request } from "express";
import prisma from "../../../shared/prisma";
import httpStatus from "http-status";

import ApiError from "../../errors/ApiError"



const registerFaceIntoDB = async (teacherId: string, descriptor: number[]) => {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, "Teacher not found");
  }

  if (teacher.isDeleted) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Teacher is deleted");
  }

  const result = await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      faceDescriptor: descriptor,
    } as any,
    select: {
      id: true,
      name: true,
      email: true,
      faceDescriptor: true,
    } as any,
  });

  return result;
};

const getAllTeachersWithDescriptors = async () => {
  const teachers = await prisma.teacher.findMany({
    where: {
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      faceDescriptor: true,
    } as any,
  });

  return teachers.filter((t: any) => t.faceDescriptor !== null);
};


const createAttendanceIntoDB = async (req: Request) => {
  const { teacherId } = req.body;

  const now = new Date(); // বর্তমান সময়

  // ১. আজকের রেঞ্জ বের করা (ডুপ্লিকেট চেক করার জন্য)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // ২. অফিস টাইম সেট করা (সকাল ১০:০০ AM)
  const officeTime = new Date(now);
  officeTime.setHours(10, 0, 0, 0);

  // ৩. ডুপ্লিকেট চেক: আজ অলরেডি অ্যাটেনডেন্স নিয়েছে কি না
  const existingAttendance = await prisma.attendance.findFirst({
    where: {
      teacherId,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (existingAttendance) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Attendance already submitted for today!");
  }

  // ৪. লেট (Late) চেক লজিক
  // যদি বর্তমান সময় ১০:০০ AM এর বেশি হয়, তবে status হবে "LATE"
  let attendanceStatus = "PRESENT";
  if (now > officeTime) {
    attendanceStatus = "LATE";
  }

  // ৫. ডাটাবেসে সেভ করা
  const result = await prisma.attendance.create({
    data: {
      teacherId,
      status: attendanceStatus,
      date: now, // সঠিক সময়টি সেভ হবে
    },
    include: {
      teacher: true,
    }
  });

  return result;
};


const getAttendancesFromDB = async () => {
  return await prisma.attendance.findMany({
    include: { teacher: true },
    orderBy: { date: 'desc' }
  });
};


export const AttendanceService = {
  createAttendanceIntoDB,
  getAttendancesFromDB,
  registerFaceIntoDB,
  getAllTeachersWithDescriptors
};