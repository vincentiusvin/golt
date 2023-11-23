import { Response as ExpResponse } from "express";
import { Code } from "./model/Code";
import { User } from "./model/User";

export type Response = ExpResponse<unknown, { user?: User; code?: Code }>;
export type UserResponse = ExpResponse<unknown, { user: User; code?: Code }>;
export type CodeResponse = ExpResponse<unknown, { user: User; code: Code }>;
