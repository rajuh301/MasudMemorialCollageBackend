import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";

const allowedFields = [
  "name",
  "position",
  "subject",
  "description",
  "rating",
];

const createOurTeacherIntoDB = async (req: Request) => {

  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadToCloudinary?.secure_url;
  }

  const result = await prisma.ourTeachers.create({
    data: req.body
  });

  return result;
};


const getOurTeachersFromDB = async () => {
  const result = await prisma.ourTeachers.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleOurTeacherFromDB = async (id: string) => {
  const teacher = await prisma.ourTeachers.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher;
};

const updateOurTeacherIntoDB = async (id: string, payload: any) => {
  const dataToUpdate: any = {};

  for (const key of Object.keys(payload)) {
    if (allowedFields.includes(key)) {
      dataToUpdate[key] = payload[key];
    } else {
      throw new Error(`Field "${key}" is not valid for Teacher`);
    }
  }

  const existingTeacher = await prisma.ourTeachers.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingTeacher) {
    throw new Error("Teacher not found or already deleted");
  }

  const result = await prisma.ourTeachers.update({
    where: { id },
    data: dataToUpdate,
  });

  return result;
};

const deleteOurTeacherFromDB = async (id: string) => {
  const existingTeacher = await prisma.ourTeachers.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingTeacher) {
    throw new Error("Teacher not found or already deleted");
  }

  const result = await prisma.ourTeachers.update({
    where: { id },
    data: { isDeleted: true },
  });

  return result;
};

export const OurTeachersService = {
  createOurTeacherIntoDB,
  getOurTeachersFromDB,
  getSingleOurTeacherFromDB,
  updateOurTeacherIntoDB,
  deleteOurTeacherFromDB,
};