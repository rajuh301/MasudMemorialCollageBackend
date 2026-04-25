"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const banner_route_1 = require("../modules/Banner/banner.route");
const subbanner_route_1 = require("../modules/SubBanner/subbanner.route");
const notice_route_1 = require("../modules/Notice/notice.route");
const event_route_1 = require("../modules/Event/event.route");
const studentsComment_route_1 = require("../modules/studentsComment/studentsComment.route");
const ourTeachers_route_1 = require("../modules/OurTeacher/ourTeachers.route");
const contact_route_1 = require("../modules/Contact/contact.route");
const studentAdmission_route_1 = require("../modules/Student/studentAdmission.route");
const department_route_1 = require("../modules/Department/department.route");
const attendance_routes_1 = require("../modules/Attendance/attendance.routes");
const news_route_1 = require("../modules/News/news.route");
const result_route_1 = require("../modules/Result/result.route");
const account_route_1 = require("../modules/Account/account.route");
const leave_route_1 = require("../modules/Leave/leave.route");
const Govermentbody_route_1 = require("../modules/Govermentbody/Govermentbody.route ");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_routes_1.userRoutes
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRoutes
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes
    },
    {
        path: '/banner',
        route: banner_route_1.BannerRoutes
    },
    {
        path: '/sub-banner',
        route: subbanner_route_1.SubBannerRoutes
    },
    {
        path: '/notice',
        route: notice_route_1.NoticeRoutes
    },
    {
        path: '/event',
        route: event_route_1.EventRoutes
    },
    {
        path: '/comment',
        route: studentsComment_route_1.StudentsCommentRoutes
    },
    {
        path: '/ourteacher',
        route: ourTeachers_route_1.OurTeachersRoutes
    },
    {
        path: '/contact',
        route: contact_route_1.ContactRoutes
    },
    {
        path: '/student',
        route: studentAdmission_route_1.StudentAdmissionRoutes
    },
    {
        path: '/department',
        route: department_route_1.DepartmentRoutes
    },
    {
        path: '/attendance',
        route: attendance_routes_1.AttendanceRoutes
    },
    {
        path: '/news',
        route: news_route_1.NewsRoutes
    },
    {
        path: '/result',
        route: result_route_1.ResultRoutes
    },
    {
        path: '/account',
        route: account_route_1.AccountRoutes
    },
    {
        path: '/leave',
        route: leave_route_1.LeaveRoutes
    },
    {
        path: '/goverment-body',
        route: Govermentbody_route_1.GovermentBodyRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
