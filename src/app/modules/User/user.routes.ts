import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { fileUploader } from '../../../helpars/fileUploader';
import { userValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userController.getAllFromDB
);


router.get(
    '/total-user',
    userController.getTotalUser
)

router.get(
    '/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    userController.getMyProfile
)

router.post(
    "/create-admin",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);


router.post(
    "/create-teacher",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createTeacher.parse(JSON.parse(req.body.data))
        return userController.createTeacher(req, res, next)
    }
);

router.post(
    "/create-office-staff",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createOfficeStaff.parse(JSON.parse(req.body.data))
        return userController.createOfficeStaff(req, res, next)
    }
);

router.get("/get-staffs",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    userController.getAllOfficeStaffs
)


router.get(
    "/get-all-teachers",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    userController.getAllTeachers
)




router.patch(
    '/:id/status',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(userValidation.updateStatus),
    userController.changeProfileStatus
);

router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfie(req, res, next)
    }
);


export const userRoutes = router;