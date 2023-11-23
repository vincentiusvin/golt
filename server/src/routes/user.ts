import { NextFunction, Request } from "express";
import { User } from "../model/User";
import {
  IUserCollectionPostRequest,
  IUserCollectionPostResponse,
} from "../shared_interfaces";
import { Response } from "../types";
import { SqlError } from "mariadb";

export const UserAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = Number(req.params["userID"]);
  if (!res.locals.user || res.locals.user.id !== userID) {
    res.send(401);
  } else {
    next();
  }
};

export const UserCollectionsPost = async (req: Request, res: Response) => {
  const { name, password } = req.body as IUserCollectionPostRequest;
  try {
    await User.add_to_db(name, password);
  } catch (error) {
    if (error instanceof SqlError) {
      res.status(401).send(error.sqlMessage);
      return;
    }
  }

  const user = await User.get_by_name(name);
  if (user) {
    res
      .status(200)
      .send({ id: user?.id, name: user.name } as IUserCollectionPostResponse);
  } else {
    res.sendStatus(500);
  }
};
