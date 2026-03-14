import { Request } from "express";
import prisma from "../../../shared/prisma";

const createNewsIntoDB = async (req: Request) => {

  const data = req.body;

  const result = await prisma.news.create({
    data: {
      lable: data.lable,
      value: data.value,
    },
  });

  return result;
};



const getNewsFromDB = async () => {

  const result = await prisma.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};



const getSingleNewsFromDB = async (id: string) => {

  const result = await prisma.news.findUnique({
    where: {
      id,
    },
  });

  return result;
};



const updateNewsIntoDB = async (id: string, data: any) => {

  const result = await prisma.news.update({
    where: {
      id,
    },
    data,
  });

  return result;
};



const deleteNewsFromDB = async (id: string) => {

  const result = await prisma.news.delete({
    where: {
      id,
    },
  });

  return result;
};



export const NewsService = {
  createNewsIntoDB,
  getNewsFromDB,
  getSingleNewsFromDB,
  updateNewsIntoDB,
  deleteNewsFromDB,
};