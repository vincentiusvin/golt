import { NextFunction } from "express";
import { SessionManager } from "../model/Session";
import { User } from "../model/User";
import { Request, Response } from "../types";
import { SessionResource, SessionResourceInput } from "../shared_interfaces";

export const SessionCollectionPost = async (
  sessionManager: SessionManager,
  req: Request<SessionResourceInput>,
  res: Response<SessionResource>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const current_token = SessionManager.get_session_token(req);
  if (current_token) {
    sessionManager.delete_session(current_token);
  }

  const { display_name, password } = req.body;

  const user = await User.login(display_name, password);
  if (!user) {
    res.sendStatus(401);
    return;
  }

  const session = sessionManager.create_session(user.id);

  res.status(200).send({ success: true, ...session.to_json() });
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
