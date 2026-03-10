import { Request } from "express";
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpars/fileUploader";
import { IFile } from "../../interfaces/file";

const createStudentAdmissionIntoDB = async (req: Request) => {

  const body = req.body;

  const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }
  const result = await prisma.studentAdmission.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
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
      previousGPA: body.previousGPA,
      passingYear: body.passingYear,

      subjects: body.subjects,

      admissionFee: body.admissionFee,
      paymentStatus: body.paymentStatus || "UNPAID",


      departmentId: body.departmentId,
    },

    include: {
      department: true,
    },
  });

  return result;
};

export const StudentAdmissionService = {
  createStudentAdmissionIntoDB,
};