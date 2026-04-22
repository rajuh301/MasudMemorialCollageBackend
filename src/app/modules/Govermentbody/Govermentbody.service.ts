import { Request } from "express";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createGovermentBodyIntoDB = async (req: Request) => {
  const file = req.file as IFile;

  if (file) {
    req.body.image = file.path;
  }

  const result = await prisma.govermentBody.create({
    data: {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
    },
  });

  return result;
};

const getAllGovermentBodiesFromDB = async () => {
  const result = await prisma.govermentBody.findMany({
    orderBy: { name: "asc" },
  });
  return result;
};

const getSingleGovermentBodyFromDB = async (id: string) => {
  const result = await prisma.govermentBody.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Government body not found");
  }

  return result;
};

const updateGovermentBodyIntoDB = async (id: string, req: Request) => {
  const file = req.file as IFile;

  const isExist = await prisma.govermentBody.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Government body not found");
  }

  const updateData: any = { ...req.body };

  if (file) {
    updateData.image = file.path;
  }

  // Remove any non-schema fields
  const { data, id: bodyId, ...sanitizedData } = updateData;

  const result = await prisma.govermentBody.update({
    where: { id },
    data: sanitizedData,
  });

  return result;
};

const deleteGovermentBodyFromDB = async (id: string) => {
  const isExist = await prisma.govermentBody.findUnique({ where: { id } });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Government body not found");
  }

  const result = await prisma.govermentBody.delete({ where: { id } });
  return result;
};

export const GovermentBodyService = {
  createGovermentBodyIntoDB,
  getAllGovermentBodiesFromDB,
  getSingleGovermentBodyFromDB,
  updateGovermentBodyIntoDB,
  deleteGovermentBodyFromDB,
};