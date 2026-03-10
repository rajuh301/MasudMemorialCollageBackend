import { Admin, Prisma, Teacher, User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpars/fileUploader";
import { IFile } from "../../interfaces/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";
import { IAuthRequest } from "../../interfaces/type";

const createAdmin = async (req: Request): Promise<Admin> => {

    // upload image
  const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

    const result = await prisma.$transaction(async (transactionClient) => {

        // 1️⃣ create user
        const createdUser = await transactionClient.user.create({
            data: {
                email: req.body.admin.email,
                password: hashedPassword,
                role: UserRole.ADMIN,
                contactNumber: req.body.admin.contactNumber
            }
        });

        // 2️⃣ create admin
        const createdAdmin = await transactionClient.admin.create({
            data: {
                name: req.body.admin.name,
                email: req.body.admin.email,
                contactNumber: req.body.admin.contactNumber,
                profilePhoto: req.body.admin.profilePhoto,
                userId: createdUser.id
            }
        });

        return createdAdmin;
    });

    return result;
};




const createTeacher = async (req: IAuthRequest): Promise<Teacher> => {
  const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const adminId = req.user.id; 

  if (!adminId) throw new Error("Cannot create teacher: Admin not authenticated.");

  const adminData = await prisma.admin.findUnique({
    where: { userId: adminId }
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const createdUser = await transactionClient.user.create({
      data: {
        email: req.body.teacher.email,
        password: hashedPassword,
        role: UserRole.TEACHER,
        contactNumber: req.body.teacher.contactNumber
      }
    });

    const createdTeacher = await transactionClient.teacher.create({
      data: {
        name: req.body.teacher.name,
        email: req.body.teacher.email,
        contactNumber: req.body.teacher.contactNumber,
        profilePhoto: req.body.teacher.profilePhoto,
        joiningDate: new Date(req.body.teacher.joiningDate),
        address: req.body.teacher.address,
        createdById: adminId, // ✅ now always string
        userId: createdUser.id
      }
    });

    return createdTeacher;
  });

  return result;
};




const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.UserWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
        }
    });

    const total = await prisma.user.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};

const getMyProfile = async (user: IAuthUser) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    });

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return { ...userInfo, ...profileInfo };
};


const updateMyProfie = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

  const file = req.file as IFile;

  if (file) {
  req.body.image = file.path;
  }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }


    return { ...profileInfo };
}


export const userService = {
    createAdmin,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfie,
    createTeacher
}