import { NextFunction } from "express";
import { User } from "../model/User";
import { UserResource, UserResourceInput } from "../shared_interfaces";
import { Request, Response, UserResponse } from "../types";

export const UserAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userID = Number(req.params["userID"]);
  if (!res.locals.user || res.locals.user.id !== userID) {
    res.status(401).send({ success: false, message: "Unauthorized!" });
  } else {
    next();
  }
};

export const UserCollectionsPost = async (
  req: Request<UserResourceInput>,
  res: Response<UserResource>
) => {
  const { display_name, password } = req.body;

  if (!display_name.length) {
    res.status(400).send({ success: false, message: "Name cannot be empty!" });
    return;
  }

  if (!password.length) {
    res
      .status(400)
      .send({ success: false, message: "Password cannot be empty!" });
    return;
  }

  if (await User.get_by_name(display_name)) {
    res
      .status(400)
      .send({ success: false, message: "This name is already taken!" });
    return;
  }

  await User.add_to_db(display_name, password);
  const user = await User.get_by_name(display_name);
  if (user) {
    res.status(200).send({ success: true, ...user.to_json() });
  } else {
    res.sendStatus(500);
  }
};

export const UserResourceGet = async (
  req: Request,
  res: UserResponse<UserResource>
) => {
  res.status(200).send({ success: true, ...res.locals.user.to_json() });
};
