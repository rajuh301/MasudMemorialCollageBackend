"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovermentBodyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../../helpars/fileUploader");
const Govermentbody_validation_1 = require("./Govermentbody.validation");
const Govermentbody_controller_1 = require("./Govermentbody.controller");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = Govermentbody_validation_1.GovermentBodyValidation.createGovermentBodyValidation.parse(JSON.parse(req.body.data));
    return Govermentbody_controller_1.GovermentBodyController.createGovermentBody(req, res, next);
});
router.get("/", Govermentbody_controller_1.GovermentBodyController.getAllGovermentBodies);
router.get("/:id", Govermentbody_controller_1.GovermentBodyController.getSingleGovermentBody);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), fileUploader_1.fileUploader.upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = Govermentbody_validation_1.GovermentBodyValidation.updateGovermentBodyValidation.parse(JSON.parse(req.body.data));
    }
    return Govermentbody_controller_1.GovermentBodyController.updateGovermentBody(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), Govermentbody_controller_1.GovermentBodyController.deleteGovermentBody);
exports.GovermentBodyRoutes = router;
