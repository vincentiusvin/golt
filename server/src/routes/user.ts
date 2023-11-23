import { NextFunction, Request } from "express";
import { User } from "../model/User";
import {
  IUserCollectionPostRequest,
  IUserCollectionPostResponse,
} from "../shared_interfaces";
import { Response } from "../types";

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

  if (await User.get_by_name(name)) {
    res.status(400).send("This name is already taken!");
    return;
  }

  await User.add_to_db(name, password);
  const user = await User.get_by_name(name);
  if (user) {
    res
      .status(200)
      .send({ id: user?.id, name: user.name } as IUserCollectionPostResponse);
  } else {
    res.sendStatus(500);
  }
};
