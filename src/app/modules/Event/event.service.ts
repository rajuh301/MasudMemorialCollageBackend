import { Request } from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";



const createEventIntoDB = async (req: Request) => {

  const file = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadToCloudinary?.secure_url;
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

const updateEventIntoDB = async (id: string, payload: any) => {

    const existingEvent = await prisma.event.findFirst({
        where:{id,
            isDeleted:false
        },
    });

  if (!existingEvent) {
    throw new Error("Event not found or already deleted");
  }

  const result = await prisma.event.update({
    where: { id },
    data: payload,
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