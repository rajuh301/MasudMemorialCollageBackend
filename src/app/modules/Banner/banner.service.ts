import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../../helpars/fileUploader";

const createBannerIntoDB = async (req: Request) => {

  const file = req.file as IFile;

  if (file) {
    req.body.image = file.path;
  }

  const result = await prisma.banner.create({
    data: req.body
  });

  return result;
};

const getBannerFromDB = async () => {

  const result = await prisma.banner.findMany({
    where: {
      isDeleted: false,
    },
  });

  return result;
};


const getSingleBannerFromDB = async (id: string) => {



  const result = await prisma.banner.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new Error("Banner not found");
  }

  return result;
};


const updateBannerIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;

  // 1. Verify existence
  const isExist = await prisma.banner.findUnique({
    where: { id, isDeleted: false },
  });

  if (!isExist) {
    throw new Error("Banner not found or already deleted");
  }

  // 2. Extract validated data from req.body
  const updateData: any = { ...req.body };

  // 3. Attach new image path if file exists
  if (file) {
    updateData.image = file.path;
  }

  // 4. Final safety: Remove any keys that aren't in the Banner Prisma Model
  // This prevents the "Unknown argument" error if 'data' or 'id' slipped through
  const { data, id: bodyId, ...sanitizedData } = updateData;

  const result = await prisma.banner.update({
    where: { id },
    data: sanitizedData,
  });

  return result;
};
const deleteBannerFromDB = async (id: string) => {

  const banner = await prisma.banner.findFirst({
    where: {
      id: id,
    },
  });

  if (!banner) {
    throw new Error("Banner not found");
  }

  const result = await prisma.banner.update({
    where: {
      id: banner.id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const BannerService = {
  createBannerIntoDB,
  getBannerFromDB,
  updateBannerIntoDB,
  deleteBannerFromDB,
  getSingleBannerFromDB
};