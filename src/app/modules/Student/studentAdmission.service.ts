import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";
;

export const createStudentAdmissionIntoDB = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    const uploaded = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploaded?.secure_url;
  }

  // Only include email if provided (avoid Prisma unique null errors)
  const data: any = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    dateOfBirth: new Date(req.body.dateOfBirth),
    gender: req.body.gender,
    bloodGroup: req.body.bloodGroup,
    maritalStatus: req.body.maritalStatus,
    presentAddress: req.body.presentAddress,
    permanentAddress: req.body.permanentAddress,
    guardianName: req.body.guardianName,
    guardianPhone: req.body.guardianPhone,
    guardianRelation: req.body.guardianRelation,
    previousSchool: req.body.previousSchool,
    previousGPA: req.body.previousGPA,
    passingYear: req.body.passingYear,
    subjects: req.body.subjects,
    admissionFee: req.body.admissionFee,
    paymentStatus: req.body.paymentStatus,
    image: req.body.image,
    department: { connect: { id: req.body.departmentId } }
  };

  if (req.body.email) data.email = req.body.email;

  const result = await prisma.studentAdmission.create({ data });
  return result;
};


export const StudentAdmissionService = {
  createStudentAdmissionIntoDB
};