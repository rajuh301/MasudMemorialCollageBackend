import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";

// Allowed fields for update
const allowedFields = ["name", "description", "batch", "image"];


const createStudentsCommentIntoDB = async (req: Request) => {

   const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }

  const result = await prisma.studentsComment.create({
    data: req.body
  });

  return result;
};




// Get all comments
const getStudentsCommentFromDB = async () => {
  const result = await prisma.studentsComment.findMany({
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// Get single comment
const getSingleStudentsCommentFromDB = async (id: string) => {
  const comment = await prisma.studentsComment.findUnique({
    where: { id },
  });
  if (!comment) {
    throw new Error("Student comment not found");
  }
  return comment;
};

// Update comment
const updateStudentsCommentIntoDB = async (id: string, payload: any) => {
  // Filter allowed fields
  const dataToUpdate: any = {};
  for (const key of Object.keys(payload)) {
    if (allowedFields.includes(key)) {
      dataToUpdate[key] = payload[key];
    } else {
      throw new Error(`Field "${key}" is not valid for Student Comment`);
    }
  }

  const existingComment = await prisma.studentsComment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new Error("Student comment not found");
  }

  const result = await prisma.studentsComment.update({
    where: { id },
    data: dataToUpdate,
  });

  return result;
};

// Delete comment
const deleteStudentsCommentFromDB = async (id: string) => {
  const existingComment = await prisma.studentsComment.findUnique({
    where: { id },
  });
  if (!existingComment) {
    throw new Error("Student comment not found");
  }

  const result = await prisma.studentsComment.delete({
    where: { id },
  });

  return result;
};

export const StudentsCommentService = {
  createStudentsCommentIntoDB,
  getStudentsCommentFromDB,
  getSingleStudentsCommentFromDB,
  updateStudentsCommentIntoDB,
  deleteStudentsCommentFromDB,
};