import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";



const createSubBannerIntoDB = async (req: Request) => {

  const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }

  const result = await prisma.subBanner.create({
    data: req.body
  });

  return result;
};







const getSubBannerFromDB = async () => {
  const result = await prisma.subBanner.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleSubBannerFromDB = async (id: string) => {
  const result = await prisma.subBanner.findUnique({
    where: {
      id,
    },
  });

  return result;
};




const updateSubBannerIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;

  // 1. Check if it exists
  const isExist = await prisma.subBanner.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error("Sub Banner not found");
  }

  // 2. Prepare payload
  const updateData: any = { ...req.body };

  if (file) {
    updateData.image = file.path;
  }

  // 3. Sanitize: remove 'data' and 'id' from the payload before Prisma update
  const { data, id: bodyId, ...sanitizedData } = updateData;

  const result = await prisma.subBanner.update({
    where: { id },
    data: sanitizedData,
  });

  return result;
};




const deleteSubBannerFromDB = async (id: string) => {
  const result = await prisma.subBanner.delete({
    where: {
      id,
    },
  });

  return result;
};

export const SubBannerService = {
  createSubBannerIntoDB,
  getSubBannerFromDB,
  getSingleSubBannerFromDB,
  updateSubBannerIntoDB,
  deleteSubBannerFromDB,
};