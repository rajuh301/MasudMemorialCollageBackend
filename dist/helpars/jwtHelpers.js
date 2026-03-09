"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Using SignOptions['expiresIn'] ensures the type matches the library's expectation
const generateToken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        algorithm: 'HS256',
        expiresIn
    });
    return token;
};
const verifyToken = (token, secret) => {
    // jwt.verify returns string | JwtPayload; casting ensures it meets your return type
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.jwtHelpers = {
    generateToken,
    verifyToken
};
