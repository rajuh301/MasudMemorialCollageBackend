"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const user_constant_1 = require("./user.constant");
const createAdmin = (req) => __awaiter(void 0, void 0, void 0, function* () {
    // upload image
    const file = req.file;
    if (file) {
        req.body.image = file.path;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // 1️⃣ create user
        const createdUser = yield transactionClient.user.create({
            data: {
                email: req.body.admin.email,
                password: hashedPassword,
                role: client_1.UserRole.ADMIN,
                contactNumber: req.body.admin.contactNumber
            }
        });
        // 2️⃣ create admin
        const createdAdmin = yield transactionClient.admin.create({
            data: {
                name: req.body.admin.name,
                email: req.body.admin.email,
                contactNumber: req.body.admin.contactNumber,
                profilePhoto: req.body.admin.profilePhoto,
                userId: createdUser.id
            }
        });
        return createdAdmin;
    }));
    return result;
});
const createTeacher = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // ১. ইমেজ হ্যান্ডেলিং (ডাটাবেসে profilePhoto ফিল্ডে যাবে)
    if (file) {
        req.body.teacher.profilePhoto = file.path;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    // ২. অ্যাডমিন ভ্যালিডেশন
    const adminEmail = req.user.email;
    const validAdmin = yield prisma_1.default.admin.findUnique({
        where: { email: adminEmail }
    });
    if (!validAdmin) {
        throw new Error("Cannot create teacher: Admin profile not found.");
    }
    // ৩. ট্রানজেকশন শুরু
    const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // User টেবিলে ডাটা সেভ (Login credentials)
        const createdUser = yield transactionClient.user.create({
            data: {
                email: req.body.teacher.email,
                password: hashedPassword,
                role: client_1.UserRole.TEACHER, // ✅ রোল সেট করা হলো
                contactNumber: req.body.teacher.contactNumber,
                status: client_1.UserStatus.ACTIVE
            }
        });
        // Teacher টেবিলে প্রোফাইল ডাটা সেভ
        const createdTeacher = yield transactionClient.teacher.create({
            data: {
                name: req.body.teacher.name,
                email: req.body.teacher.email,
                contactNumber: req.body.teacher.contactNumber,
                profilePhoto: req.body.teacher.profilePhoto || null, // ✅ ক্লাউডিনারি URL
                joiningDate: new Date(req.body.teacher.joiningDate),
                address: req.body.teacher.address,
                createdById: validAdmin.id, // ✅ কোন এডমিন তৈরি করেছে তার আইডি
                userId: createdUser.id // ✅ User টেবিলের সাথে কানেকশন
            }
        });
        return createdTeacher;
    }));
    return result;
});
const createOfficeStaff = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    // ✅ 1. Handle image upload
    if (file) {
        req.body.officeStaff.profilePhoto = file.path;
    }
    const hashedPassword = yield bcrypt.hash(req.body.password, 12);
    // ✅ 2. Extract DOB and create default password (DD-MM-YYYY)
    const dob = new Date(req.body.officeStaff.dateOfBirth);
    // ✅ 3. Validate Admin
    const adminEmail = req.user.email;
    const validAdmin = yield prisma_1.default.admin.findUnique({
        where: { email: adminEmail }
    });
    if (!validAdmin) {
        throw new Error("Cannot create office staff: Admin profile not found.");
    }
    // ✅ 4. Transaction
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 🔹 Create User (for login)
        const createdUser = yield tx.user.create({
            data: {
                email: req.body.officeStaff.email,
                password: hashedPassword,
                role: client_1.UserRole.OFFICESTAFF,
                contactNumber: req.body.officeStaff.contactNumber,
                status: client_1.UserStatus.ACTIVE
            }
        });
        // 🔹 Create OfficeStaff profile
        const createdOfficeStaff = yield tx.officeStaff.create({
            data: {
                name: req.body.officeStaff.name,
                email: req.body.officeStaff.email,
                contactNumber: req.body.officeStaff.contactNumber,
                profilePhoto: req.body.officeStaff.profilePhoto || null,
                joiningDate: new Date(req.body.officeStaff.joiningDate),
                address: req.body.officeStaff.address,
                // ✅ Required fields
                dateOfBirth: dob,
                // ✅ Relations
                createdById: validAdmin.id,
                userId: createdUser.id
            }
        });
        return createdOfficeStaff;
    }));
    return result;
});
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: user_constant_1.userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    ;
    const whereConditons = andCondions.length > 0 ? { AND: andCondions } : {};
    const result = yield prisma_1.default.user.findMany({
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
    const total = yield prisma_1.default.user.count({
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
});
const changeProfileStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = yield prisma_1.default.user.update({
        where: {
            id
        },
        data: status
    });
    return updateUserStatus;
});
const getMyProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            admin: true,
            officeStaff: true,
            teacher: true,
            studentAdmission: true
        }
    });
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    return Object.assign(Object.assign({}, userInfo), profileInfo);
});
const updateMyProfie = (user, req) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user === null || user === void 0 ? void 0 : user.email,
            status: client_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if (file) {
        req.body.image = file.path;
    }
    let profileInfo;
    if (userInfo.role === client_1.UserRole.SUPER_ADMIN) {
        profileInfo = yield prisma_1.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === client_1.UserRole.ADMIN) {
        profileInfo = yield prisma_1.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    return Object.assign({}, profileInfo);
});
const getTotalUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = (yield prisma_1.default.teacher.findMany()).length;
    const student = (yield prisma_1.default.studentAdmission.findMany()).length;
    const department = (yield prisma_1.default.department.findMany()).length;
    return {
        teacher,
        student,
        department,
        prize: 50
    };
});
const getAllTeachers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.teacher.findMany({
        where: { isDeleted: false }
    });
    return result;
});
const getAllOfficeStaffs = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        where: {
            role: client_1.UserRole.OFFICESTAFF
        },
        select: {
            id: true,
            email: true,
            contactNumber: true,
            officeStaff: {
                select: {
                    name: true,
                    profilePhoto: true,
                    joiningDate: true,
                    address: true
                }
            }
        }
    });
    return result;
});
const getAllStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studentAdmission.findMany({
        where: { isDeleted: false }
    });
    return result;
});
exports.userService = {
    createAdmin,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfie,
    createTeacher,
    getTotalUser,
    getAllTeachers,
    createOfficeStaff,
    getAllOfficeStaffs,
    getAllStudents
};
