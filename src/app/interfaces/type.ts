import { Request } from "express";
import { UserRole } from "@prisma/client";

export interface IAuthRequest extends Request {
  user: {
    id: string;
    email: string;
    role: UserRole;
  }
}