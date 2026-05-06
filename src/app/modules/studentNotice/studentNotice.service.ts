import prisma from "../../../shared/prisma";
const createStudentNoticeIntoDB = async (payload: any) => {
    const { studentRoll, departmentId, description } = payload;

    // Step 1: Find student by roll and get their id
    const student = await prisma.studentAdmission.findUnique({
        where: {
            studentRoll: studentRoll,
        },
        select: {
            id: true,
        },
    });

    if (!student) {
        throw new Error("Student not found with this roll number");
    }

    // Step 2: Create notice with found studentId
    const result = await prisma.studentNotice.create({
        data: {
            studentRoll,
            departmentId,
            description,
            studentId: student.id
        },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};


const getAllStudentNoticesFromDB = async () => {
    const result = await prisma.studentNotice.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

const getSingleStudentNoticeFromDB = async (id: string) => {
    const result = await prisma.studentNotice.findUnique({
        where: { id },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

const getNoticesByDepartmentFromDB = async (departmentId: string) => {
    const result = await prisma.studentNotice.findMany({
        where: { departmentId },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

const getNoticesByStudentRollFromDB = async (studentRoll: string) => {
    const result = await prisma.studentNotice.findMany({
        where: { studentRoll },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

const updateStudentNoticeIntoDB = async (id: string, payload: any) => {
    const result = await prisma.studentNotice.update({
        where: { id },
        data: payload,
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

const deleteStudentNoticeFromDB = async (id: string) => {
    const result = await prisma.studentNotice.delete({
        where: { id },
    });

    return result;
};

const ownNotice = async (studentEmail: string) => {
    // Step 1: Find student by email and get their roll
    const student = await prisma.studentAdmission.findUnique({
        where: {
            email: studentEmail,
        },
        select: {
            studentRoll: true, // ✅ correct select syntax
        },
    });

    if (!student) {
        throw new Error("Student not found");
    }

    // Step 2: Find notices by studentRoll
    const result = await prisma.studentNotice.findMany({
        where: {
            studentRoll: student.studentRoll,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            department: true,
            student: true,
        },
    });

    return result;
};

export const StudentNoticeService = {
    createStudentNoticeIntoDB,
    getAllStudentNoticesFromDB,
    getSingleStudentNoticeFromDB,
    getNoticesByDepartmentFromDB,
    getNoticesByStudentRollFromDB,
    updateStudentNoticeIntoDB,
    deleteStudentNoticeFromDB,
    ownNotice
};