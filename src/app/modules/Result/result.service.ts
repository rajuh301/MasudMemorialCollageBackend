import prisma from "../../../shared/prisma";

const createResultIntoDB = async (payload: any) => {
  const { studentRoll, departmentId, examType, academicYear, subjects } = payload; // ✅ added academicYear

  // 1️⃣ Fetch student from StudentAdmission table
  const student = await prisma.studentAdmission.findUnique({
    where: {
      studentRoll: studentRoll,
    },
    select: {
      firstName: true,
      lastName: true,
    },
  });

  if (!student) {
    throw new Error("Student not found with this roll number");
  }

  // 2️⃣ Create multiple result rows
  const result = await prisma.result.createMany({
    data: subjects.map((sub: any) => ({
      studentRoll,
      departmentId,
      subject: sub.subject,
      marks: sub.marks,
      grade: sub.grade,
      examType,
      academicYear, // ✅ added academicYear
    })),
    skipDuplicates: true,
  });

  return result;
};



const getStudentResultFromDB = async (roll: string, departmentId: string) => {
  const results = await prisma.result.findMany({
    where: {
      studentRoll: roll,
      departmentId: departmentId,
    },
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });

  if (!results.length) throw new Error("No result found for this student");

  // ✅ Group by examType + academicYear
  const grouped: Record<string, any> = {};

  for (const r of results) {
    const key = `${r.examType}_${r.academicYear}`;

    if (!grouped[key]) {
      grouped[key] = {
        exam: r.examType,
        department: r.department?.name || "N/A",
        year: r.academicYear,
        subjects: [],
      };
    }

    grouped[key].subjects.push({
      subject: r.subject,
      marks: r.marks,
      grade: r.grade,
    });
  }

  // ✅ Final clean response
  return Object.values(grouped).map((item) => ({
    exam: item.exam,
    department: item.department,
    year: item.year,
    subjects: item.subjects,
  }));
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
    include: {
      id: true,
      studentRoll: true,
      subject: true,
      department: true,
      student: {
        select: {
          firstName: true,
          lastName: true,
          dateofBirth: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
  });
};

// ✅ Grade priority list
const gradeOrder = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

const getOverallGrade = (grades: string[]): string => {
  if (grades.includes("F")) return "F"; // যেকোনো F মানেই overall F
  for (const g of gradeOrder) {
    if (grades.includes(g)) return g; // সবচেয়ে ভালো grade
  }
  return "N/A";
};

const getPublicResultFromDB = async () => {
  const results = await prisma.result.findMany({
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Collect all unique student rolls (no repeated DB calls)
  const uniqueRolls = [...new Set(results.map((r) => r.studentRoll))];

  // ✅ Fetch all students at once (single DB call)
  const students = await prisma.studentAdmission.findMany({
    where: { studentRoll: { in: uniqueRolls } },
    select: { studentRoll: true, firstName: true, lastName: true },
  });

  // ✅ Map for quick lookup
  const studentMap: Record<string, string> = {};
  for (const s of students) {
    studentMap[s.studentRoll] = `${s.firstName} ${s.lastName}`;
  }

  // ✅ Group by studentRoll + examType + academicYear
  const grouped: Record<string, any> = {};

  for (const r of results) {
    const key = `${r.studentRoll}_${r.examType}_${r.academicYear}`;

    if (!grouped[key]) {
      grouped[key] = {
        roll: r.studentRoll,
        name: studentMap[r.studentRoll] || "Unknown",
        exam: r.examType,
        department: r.department?.name || "N/A",
        year: r.academicYear,
        grades: [],
      };
    }

    grouped[key].grades.push(r.grade);
  }

  // ✅ Final clean response
  return Object.values(grouped).map((item) => ({
    roll: item.roll,
    name: item.name,
    exam: item.exam,
    department: item.department,
    year: item.year,
    grade: getOverallGrade(item.grades), // একটাই overall grade
  }));
};

const getResultRecordsFromDB = async () => {
  return prisma.result.findMany({
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });
};

const deleteResult = async (id: string) => {
  return prisma.result.delete({
    where: { id },
  });
};




export const ResultService = {
  createResultIntoDB,
  getStudentResultFromDB,
  getLatestResultsFromDB,
  getAllResultsFromDB,
  getPublicResultFromDB,
  getResultRecordsFromDB,
  deleteResult
};