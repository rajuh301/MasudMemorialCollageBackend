"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("./contact.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const contact_validation_1 = require("./contact.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create-contact", (0, validateRequest_1.default)(contact_validation_1.ContactValidation.createContactValidation), contact_controller_1.ContactController.createContact);
router.get("/", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), contact_controller_1.ContactController.getContacts);
router.get("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), contact_controller_1.ContactController.getSingleContact);
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.ADMIN), contact_controller_1.ContactController.deleteContact);
exports.ContactRoutes = router;
