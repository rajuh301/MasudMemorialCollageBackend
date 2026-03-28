import prisma from "../../../shared/prisma";

const createResultIntoDB = async (payload: any) => {
  const { studentRoll, departmentId, examType, subjects } = payload;

  // 1️⃣ Fetch student name from Student table using studentRoll
  const student = await prisma.studentAdmission.findUnique({
    where: {
      studentRoll: studentRoll // Or adjust if you store roll differently
    },
    select: {
      firstName: true,
      lastName: true
    }
  });

  if (!student) {
    throw new Error("Student not found with this roll number");
  }

  const studentName = student.firstName;

  // 2️⃣ Create multiple result rows
  const result = await prisma.result.createMany({
    data: subjects.map((sub: any) => ({
      studentRoll,
      studentName,
      departmentId,
      subject: sub.subject,
      marks: sub.marks,
      grade: sub.grade,
      examType,
    })),
    skipDuplicates: true,
  });

  return result;
};
const getStudentResultFromDB = async (
  roll: string,
  departmentId: string
) => {
  return prisma.result.findMany({
    where: {
      studentRoll: roll,
      departmentId: departmentId,
    },
    include: {
      department: true,
    },
  });
};

const getLatestResultsFromDB = async () => {
  return prisma.result.findMany({
    include: {
      department: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
};

const getAllResultsFromDB = async () => {
  return prisma.result.findMany({
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });
};

// ✅ Export ONE service object with all functions
export const ResultService = {
  createResultIntoDB,
  getStudentResultFromDB,
  getLatestResultsFromDB,
  getAllResultsFromDB,
};