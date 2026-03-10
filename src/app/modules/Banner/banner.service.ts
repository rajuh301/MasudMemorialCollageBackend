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

  if(!result){
    throw new Error("Banner not found");
  }

  return result;
};

const updateBannerIntoDB = async (id: string, data: any) => {

  const banner = await prisma.banner.findFirst({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!banner) {
    throw new Error("Banner not found");
  }

  const result = await prisma.banner.update({
    where: {
      id: banner.id,
    },
    data: data,
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