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
    req.body.image = file.path;
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

const updateOurTeacherIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;
  
  // 1. Check if teacher exists
  const existingTeacher = await prisma.ourTeachers.findUnique({
    where: { id, isDeleted: false },
  });

  if (!existingTeacher) {
    throw new Error("Teacher not found or already deleted");
  }

  // 2. Clone the body so we don't mutate the original request
  const updateData: any = { ...req.body };

  // 3. Handle image if uploaded
  if (file) {
    updateData.image = file.path;
  }

  // 4. CLEANUP: Prisma will throw an error if "data", "file", or "id" 
  // are inside the data object. We must remove them.
  delete updateData.data; 
  delete updateData.id;
  delete updateData.file;

  // 5. Execute Update
  const result = await prisma.ourTeachers.update({
    where: { id },
    data: updateData, // This now contains name, position, subject, etc.
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