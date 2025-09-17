import { User } from "@prisma/client";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: Pick<User, 'id' | 'email' | 'name' | 'role' | 'profilePicture'>
}
