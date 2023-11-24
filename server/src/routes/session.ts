import { NextFunction } from "express";
import { User } from "../model/User";
import { Request, Response } from "../types";
import { SessionResource, SessionResourceInput } from "../shared_interfaces";
import { Session } from "../model/Session";

export const SessionCollectionPost = async (
  req: Request<SessionResourceInput>,
  res: Response<SessionResource>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const current_token = Session.get_session_token(req);
  if (current_token) {
    res
      .status(400)
      .send({ success: false, message: "You need to log out first!" });
    return;
  }

  const { display_name, password } = req.body;

  const user = await User.login(display_name, password);
  if (!user) {
    res.status(401).send({ success: false, message: "Unathorized!" });
    return;
  }

  const session = await Session.create_session(user.id);
  if (session) {
    res.status(200).send({ success: true, ...session.to_json() });
  } else {
    res.status(500).send({ success: false, message: "Internal server error!" });
  }
};

export const SessionCollectionDelete = async (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  const token = Session.get_session_token(req);

  if (token) {
    await Session.delete_session(token);
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ success: false, message: "Session not found!" });
  }
};

export const SessionMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = Session.get_session_token(req);
  const session = token && (await Session.get_session(token));
  const user = session && (await User.get_by_id(session.user_id));
  if (user) {
    res.locals.user = user;
  }
  next();
};
