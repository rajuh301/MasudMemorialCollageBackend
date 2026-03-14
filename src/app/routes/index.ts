import express from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/Auth/auth.routes';
import { BannerRoutes } from '../modules/Banner/banner.route';
import { SubBannerRoutes } from '../modules/SubBanner/subbanner.route';
import { NoticeRoutes } from '../modules/Notice/notice.route';
import { EventRoutes } from '../modules/Event/event.route';
import { StudentsCommentRoutes } from '../modules/studentsComment/studentsComment.route';
import { OurTeachersRoutes } from '../modules/OurTeacher/ourTeachers.route';
import { ContactRoutes } from '../modules/Contact/contact.route';
import { StudentAdmissionRoutes } from '../modules/Student/studentAdmission.route';
import { DepartmentRoutes } from '../modules/Department/department.route';
import { AttendanceRoutes } from '../modules/Attendance/attendance.routes';
import { NewsRoutes } from '../modules/News/news.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: AdminRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },

    {
        path: '/banner',
        route:BannerRoutes
    },
    {
        path: '/sub-banner',
        route: SubBannerRoutes
    },
    {
        path: '/notice',
        route: NoticeRoutes
    },
    {
        path: '/event',
        route: EventRoutes
    },
    {
        path: '/comment',
        route: StudentsCommentRoutes
    },
    {
        path: '/ourteacher',
        route: OurTeachersRoutes
    },
    {
        path: '/contact',
        route: ContactRoutes
    },
    {
        path: '/student',
        route: StudentAdmissionRoutes
    },
  
    {
        path: '/department',
        route: DepartmentRoutes
    },
    {
        path: '/attendance',
        route: AttendanceRoutes
    },
    {
        path: '/news',
        route: NewsRoutes
    },
  
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;