import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";



const createEventIntoDB = async (req: Request) => {

  const file = req.file as IFile;

  if (file) {
    req.body.image = file.path;
  }
  const result = await prisma.event.create({
    data: {
      ...req.body,
      date: new Date(req.body.date) // convert user input
    }
  });

  return result;
};



const getEventFromDB = async () => {
  const result = await prisma.event.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

const getSingleEventFromDB = async (id: string) => {
  const result = await prisma.event.findUnique({
    where: { id },
  });
  return result;
};
const updateEventIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;

  const isExist = await prisma.event.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error("Event not found or already deleted");
  }

  const updateData: any = { ...req.body };

  if (file) {
    updateData.image = file.path;
  }

  // Handle Date conversion if date is being updated
  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }

  // Sanitize data to remove non-schema fields (like 'data' from Postman)
  const { data, id: bodyId, ...sanitizedData } = updateData;

  const result = await prisma.event.update({
    where: { id },
    data: sanitizedData,
  });

  return result;
};

const deleteEventFromDB = async (id: string) => {
  const result = await prisma.event.update({
    where: { id },
    data: { isDeleted: true },
  });
  return result;
};

export const EventService = {
  createEventIntoDB,
  getEventFromDB,
  getSingleEventFromDB,
  updateEventIntoDB,
  deleteEventFromDB,
};