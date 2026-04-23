import { PaymentStatus, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

// ─── Helper: dateOfBirth → "DD/MM/YYYY" default password ─────────────────────
// e.g. new Date("2006-10-10") → "10/10/2006"
const buildDefaultPassword = (dateOfBirth: Date): string => {
  const dd = String(dateOfBirth.getDate()).padStart(2, "0");
  const mm = String(dateOfBirth.getMonth() + 1).padStart(2, "0");
  const yyyy = dateOfBirth.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// ─── Create Student Admission ─────────────────────────────────────────────────
const createStudentAdmissionIntoDB = async (req: Request) => {
  const body = req.body;
  const file = req.file as IFile;

  let imageUrl = null;
  if (file) {
    imageUrl = file.path;
  }

  // ── Auto-generate student roll ─────────────────────────────────────────────
  const lastStudent = await prisma.studentAdmission.findFirst({
    orderBy: { createdAt: "desc" },
    select: { studentRoll: true },
  });

  let newRoll = "001";
  if (lastStudent?.studentRoll) {
    const lastRollNumber = parseInt(lastStudent.studentRoll);
    newRoll = String(lastRollNumber + 1).padStart(3, "0");
  }

  // ── Build default password from dateOfBirth (same pattern as createAdmin) ──
  const dateOfBirth = new Date(body.dateOfBirth);
  const defaultPassword = buildDefaultPassword(dateOfBirth); // "10/10/2006"
  const hashedPassword: string = await bcrypt.hash(defaultPassword, 12);

  // ── Student login email ────────────────────────────────────────────────────
  const loginEmail = body.email || `${newRoll}@student.mmc.edu`;

  // ── Run everything in a transaction (same pattern as createAdmin) ──────────
  const result = await prisma.$transaction(async (transactionClient) => {

    // Check email not already taken
    const existingUser = await transactionClient.user.findUnique({
      where: { email: loginEmail },
    });
    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "A user with this email already exists"
      );
    }

    // 1️⃣ Create User (same structure as createAdmin/createTeacher)
    const createdUser = await transactionClient.user.create({
      data: {
        email: loginEmail,
        password: hashedPassword,
        role: UserRole.STUDENT,
        needPasswordChange: true, // Force password change on first login
        status: UserStatus.ACTIVE,
        contactNumber: body.phone,
      },
    });

    // 2️⃣ Create StudentAdmission linked to User
    const createdAdmission = await transactionClient.studentAdmission.create({
      data: {
        studentRoll: newRoll,
        firstName: body.firstName,
        lastName: body.lastName,
        email: loginEmail,
        phone: body.phone,
        dateOfBirth,
        gender: body.gender,
        bloodGroup: body.bloodGroup,
        maritalStatus: body.maritalStatus,
        presentAddress: body.presentAddress,
        permanentAddress: body.permanentAddress,
        guardianName: body.guardianName,
        guardianPhone: body.guardianPhone,
        guardianRelation: body.guardianRelation,
        previousSchool: body.previousSchool,
        previousGPA: parseFloat(body.previousGPA),
        passingYear: parseInt(body.passingYear),
        subjects: body.subjects,
        admissionFee: body.admissionFee ? parseFloat(body.admissionFee) : null,
        paymentStatus: body.paymentStatus || PaymentStatus.UNPAID,
        image: imageUrl,
        departmentId: body.departmentId,
        userId: createdUser.id,
      },
      include: { department: true },
    });

    // 3️⃣ Create Student record (for leave, attendance etc.)
    await transactionClient.student.create({
      data: {
        name: `${body.firstName} ${body.lastName}`,
        email: loginEmail,
        phone: body.phone,
        profilePhoto: imageUrl,
        isPasswordChange: false,
        userId: createdUser.id,
      },
    });

    return {
      admission: createdAdmission,
      loginCredentials: {
        email: loginEmail,
        defaultPassword, // Plain text — admin shares this with student once
        note: "Student must change password on first login",
      },
    };
  });

  return result;
};

// ─── Change Password (First Login & Thereafter) ───────────────────────────────
const changeStudentPassword = async (
  authUser: any,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: authUser.id },
  });

  // Verify old password (same bcrypt.compare pattern)
  const isOldPasswordCorrect = await bcrypt.compare(
    payload.oldPassword,
    user.password
  );
  if (!isOldPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  const hashedNewPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.$transaction(async (transactionClient) => {
    // Update User — mark needPasswordChange false
    await transactionClient.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        needPasswordChange: false,
      },
    });

    // Update Student — mark isPasswordChange true
    await transactionClient.student.update({
      where: { userId: user.id },
      data: { isPasswordChange: true },
    });
  });

  return { message: "Password changed successfully" };
};

// ─── Get All Admissions ───────────────────────────────────────────────────────
const getAllStudentAdmissionsFromDB = async (query: any) => {
  const { page = 1, limit = 10, departmentId, gender, paymentStatus } = query;

  const where: any = { isDeleted: false };
  if (departmentId) where.departmentId = departmentId;
  if (gender) where.gender = gender;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    prisma.studentAdmission.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { department: true },
    }),
    prisma.studentAdmission.count({ where }),
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data,
  };
};

// ─── Get Single Admission ─────────────────────────────────────────────────────
const getSingleStudentAdmissionFromDB = async (id: string) => {
  const result = await prisma.studentAdmission.findUnique({
    where: { id },
    include: { department: true },
  });

  if (!result || result.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student admission not found");
  }

  return result;
};

// ─── Update Admission ─────────────────────────────────────────────────────────
const updateStudentAdmissionIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;
  const body = req.body;

  const admission = await prisma.studentAdmission.findUnique({ where: { id } });

  if (!admission || admission.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student admission not found");
  }

  const updateData: any = { ...body };
  if (file) updateData.image = file.path;
  if (body.dateOfBirth) updateData.dateOfBirth = new Date(body.dateOfBirth);
  if (body.previousGPA) updateData.previousGPA = parseFloat(body.previousGPA);
  if (body.passingYear) updateData.passingYear = parseInt(body.passingYear);
  if (body.admissionFee) updateData.admissionFee = parseFloat(body.admissionFee);

  const { data, id: bodyId, ...sanitizedData } = updateData;

  const result = await prisma.studentAdmission.update({
    where: { id },
    data: sanitizedData,
    include: { department: true },
  });

  return result;
};

// ─── Delete Admission (Soft) ──────────────────────────────────────────────────
const deleteStudentAdmissionFromDB = async (id: string) => {
  const admission = await prisma.studentAdmission.findUnique({ where: { id } });

  if (!admission || admission.isDeleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student admission not found");
  }

  const result = await prisma.studentAdmission.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const StudentAdmissionService = {
  createStudentAdmissionIntoDB,
  changeStudentPassword,
  getAllStudentAdmissionsFromDB,
  getSingleStudentAdmissionFromDB,
  updateStudentAdmissionIntoDB,
  deleteStudentAdmissionFromDB,
};