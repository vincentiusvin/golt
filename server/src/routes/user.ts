import { NextFunction, Request as OldRequest, Response } from "express";
import { User } from "../model/User";

interface Request extends OldRequest {
  user?: User; // authenticated user
}

export const UserAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = Number(req.params["userID"]);
  if (!req.user || req.user.id !== userID) {
    res.send(401);
  } else {
    next();
  }
};
