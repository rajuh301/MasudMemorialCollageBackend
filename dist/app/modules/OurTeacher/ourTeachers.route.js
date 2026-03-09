"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurTeachersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const ourTeachers_controller_1 = require("./ourTeachers.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const ourTeachers_validation_1 = require("./ourTeachers.validation");
const fileUploader_1 = require("../../../helpars/fileUploader");
const router = express_1.default.Router();
router.post("/create-teacher", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = ourTeachers_validation_1.OurTeachersValidation.createOurTeacherValidation.parse(JSON.parse(req.body.data));
    return ourTeachers_controller_1.OurTeachersController.createOurTeacher(req, res, next);
});
router.get("/", ourTeachers_controller_1.OurTeachersController.getOurTeachers);
router.get("/:id", ourTeachers_controller_1.OurTeachersController.getSingleOurTeacher);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(ourTeachers_validation_1.OurTeachersValidation.updateOurTeacherValidation), ourTeachers_controller_1.OurTeachersController.updateOurTeacher);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), ourTeachers_controller_1.OurTeachersController.deleteOurTeacher);
exports.OurTeachersRoutes = router;
