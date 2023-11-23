import { NextFunction, Request } from "express";
import { SessionManager } from "../model/Session";
import { User } from "../model/User";
import {
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
} from "../shared_interfaces";
import { Response } from "../types";

export const SessionCollectionPost = async (
  sessionManager: SessionManager,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const current_token = SessionManager.get_session_token(req);
  if (current_token) {
    sessionManager.delete_session(current_token);
  }

  const { name, password } = req.body as ISessionCollectionPostRequest;

  const user = await User.login(name, password);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  const session = sessionManager.create_session(user.id);
  res.status(200).send({
    name: session.user_id,
    expires: session.expires,
    token: session.token,
  } as ISessionCollectionPostResponse);
};

export const SessionMiddleware = async (
  sessionManager: SessionManager,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = SessionManager.get_session_token(req);
  const session = token && sessionManager.get_session(token);
  const user = session && (await User.get_by_id(session.user_id));
  if (user) {
    res.locals.user = user;
  }
  next();
};
