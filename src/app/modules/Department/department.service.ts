import prisma from "../../../shared/prisma";

const createDepartmentIntoDB = async (payload: any) => {
  const result = await prisma.department.create({
    data: payload,
  });

  return result;
};

const getDepartmentsFromDB = async () => {
  const result = await prisma.department.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return result;
};

const getSingleDepartmentFromDB = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: {
      id,
    },
  });

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

const updateDepartmentIntoDB = async (id: string, payload: any) => {
  const result = await prisma.department.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteDepartmentFromDB = async (id: string) => {
  const result = await prisma.department.delete({
    where: {
      id,
    },
  });

  return result;
};

export const DepartmentService = {
  createDepartmentIntoDB,
  getDepartmentsFromDB,
  getSingleDepartmentFromDB,
  updateDepartmentIntoDB,
  deleteDepartmentFromDB,
};