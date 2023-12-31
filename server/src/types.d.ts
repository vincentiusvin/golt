import express from "express";
import { Code } from "./model/Code";
import { User } from "./model/User";
import { ResponseBody } from "./shared_interfaces";
import { ParamsDictionary, Query } from "express-serve-static-core";

export type Response<T = void> = express.Response<
  ResponseBody<T>,
  { user?: User; code?: Code }
>;
export type UserResponse<T = void> = express.Response<
  ResponseBody<T>,
  { user: User; code?: Code }
>;
export type CodeResponse<T = void> = express.Response<
  ResponseBody<T>,
  { user: User; code: Code }
>;

export type Request<T = Record<string, undefined>> = express.Request<
  ParamsDictionary,
  unknown,
  T,
  Query
>;
