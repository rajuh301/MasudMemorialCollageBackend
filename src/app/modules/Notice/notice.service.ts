import prisma from "../../../shared/prisma";

const createNoticeIntoDB = async (payload: any) => {
  const result = await prisma.notice.create({
    data: payload,
  });

  return result;
};

const getNoticeFromDB = async () => {
  const result = await prisma.notice.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleNoticeFromDB = async (id: string) => {
  const result = await prisma.notice.findUnique({
    where: {
      id,
    },
  });

  return result;
};

const updateNoticeIntoDB = async (id: string, payload: any) => {
  const result = await prisma.notice.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteNoticeFromDB = async (id: string) => {
  const result = await prisma.notice.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  return result;
};

export const NoticeService = {
  createNoticeIntoDB,
  getNoticeFromDB,
  getSingleNoticeFromDB,
  updateNoticeIntoDB,
  deleteNoticeFromDB,
};