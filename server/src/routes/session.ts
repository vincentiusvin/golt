import { NextFunction, Request as OldRequest, Response } from "express";
import { SessionManager } from "../model/Session";
import { User } from "../model/User";
import {
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
} from "../shared_interfaces";
import { Code } from "../model/Code";

interface Request extends OldRequest {
  user?: User; // authenticated user
  code?: Code; // code handler
}

export const SessionCollectionPost = async (
  sessionManager: SessionManager,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  sessionManager.delete_session(SessionManager.get_session_token(req));
  const { name, password } = req.body as ISessionCollectionPostRequest;

  const user = await User.login(name, password);
  if (!user) {
    res.sendStatus(401);
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
  const session = sessionManager.get_session(
    SessionManager.get_session_token(req)
  );
  if (session) {
    req.user = await User.get_by_id(session.user_id);
  }
  next();
};
