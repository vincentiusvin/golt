import { NextFunction, Request } from "express";
import { Response } from "../types";

export const LoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const msg =
    `${req.method} ${req.originalUrl}` +
    (res.locals.user ? ` by ${res.locals.user.name}` : "");
  console.log(msg);
  next();
};
