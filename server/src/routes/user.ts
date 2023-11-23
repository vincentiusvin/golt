import { NextFunction, Request } from "express";
import { User } from "../model/User";
import {
  IUserCollectionPostRequest,
  IUserResourceGetResponse,
} from "../shared_interfaces";
import { Response, UserResponse } from "../types";

export const UserAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = Number(req.params["userID"]);
  if (!res.locals.user || res.locals.user.id !== userID) {
    res.sendStatus(401);
  } else {
    next();
  }
};

export const UserCollectionsPost = async (req: Request, res: Response) => {
  const { display_name, password } = req.body as IUserCollectionPostRequest;

  if (!display_name.length) {
    res.status(400).send("Name cannot be empty!");
    return;
  }

  if (!password.length) {
    res.status(400).send("Password cannot be empty!");
    return;
  }

  if (await User.get_by_name(display_name)) {
    res.status(400).send("This name is already taken!");
    return;
  }

  await User.add_to_db(display_name, password);
  const user = await User.get_by_name(display_name);
  if (user) {
    const response: IUserResourceGetResponse = {
      id: user.id,
      display_name: user.name,
    };
    res.status(200).send(response);
  } else {
    res.sendStatus(500);
  }
};

export const UserResourceGet = async (req: Request, res: UserResponse) => {
  const response: IUserResourceGetResponse = {
    id: res.locals.user.id,
    display_name: res.locals.user.name,
  };
  res.status(200).send(response);
};
