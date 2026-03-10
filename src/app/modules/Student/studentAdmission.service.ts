import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";

export const createStudentAdmissionIntoDB = async (req: Request) => {
  const file = req.file as IFile;
  const body = req.body;

  let imageUrl = body.image;
  
  if (file) {
    const uploaded = await fileUploader.uploadToCloudinary(file);
    imageUrl = uploaded?.secure_url;
  }

  // Prepare the data for Prisma
  const data: any = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: body.phone,
    dateOfBirth: new Date(body.dateOfBirth),
    gender: body.gender,
    bloodGroup: body.bloodGroup,
    maritalStatus: body.maritalStatus,
    presentAddress: body.presentAddress,
    permanentAddress: body.permanentAddress,
    guardianName: body.guardianName,
    guardianPhone: body.guardianPhone,
    guardianRelation: body.guardianRelation,
    previousSchool: body.previousSchool,
    previousGPA: body.previousGPA ? parseFloat(body.previousGPA) : null,
    passingYear: body.passingYear ? parseInt(body.passingYear) : null,
    subjects: Array.isArray(body.subjects) ? body.subjects : JSON.parse(body.subjects || '[]'),
    admissionFee: body.admissionFee ? parseFloat(body.admissionFee) : null,
    paymentStatus: body.paymentStatus || "UNPAID",
    image: imageUrl,
    department: {
      connect: { id: body.departmentId }
    }
  };

  // Add email if provided
  if (body.email) {
    data.email = body.email;
  }

  const result = await prisma.studentAdmission.create({
    data,
    include: {
      department: true
    }
  });
  
  return result;
};

export const StudentAdmissionService = {
  createStudentAdmissionIntoDB
};