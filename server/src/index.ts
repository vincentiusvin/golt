import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, {
  Request as OldRequest,
  Response,
  NextFunction,
} from "express";
import { SessionManager } from "./model/Session";
import {
  ICodeGetRequest,
  ICodeGetResponse,
  ICodePostRequest,
  ICodePostResponse,
  ISessionPostRequest,
  ISessionPostResponse,
} from "./shared_interfaces";
import { User, UserManager } from "./model/User";

const app = express();
const port = 3000;
const sessionManager = new SessionManager();
const userManager = new UserManager();

app.use(cookieParser());

interface Request extends OldRequest {
  user?: User;
}
const auth = (req: Request, res: Response, next: NextFunction) => {
  const user = sessionManager.get_session(
    SessionManager.get_session_token(req)
  ).user;
  req.userID = user;
  next();
};
app.use(auth);

const logger = (req: Request, res: Response, next: NextFunction) => {
  const msg =
    `${req.method} ${req.originalUrl}` +
    (req.user ? ` by ${req.user.username}` : "");
  console.log(msg);
  next();
};
app.use(logger);

app.use(json());

app.get("/api", (req, res) => {
  res.status(200).send("API Endpoint :)");
});

app.get(
  "/api/users/:userID",
  (req: Request, res: Response, next: NextFunction) => {
    const userID = Number(req.params["userID"]);
    if (!req.user || req.user.id !== userID) {
      res.send(401);
    } else {
      next();
    }
  }
);

app.get("/api/users/:userID/codes/:codeID", (req: Request, res: Response) => {
  const { userID, codeID } = req.params;
  res.status(200).json({
    code: code.get_code(),
    ...code.get_output(),
  });
});

app.get("/api/code", (req: Request, res: Response) => {
  const user = sessionManager.get_session(
    SessionManager.get_session_token(req)
  ).user;
  console.log(`GET /api/code by ${user.username}`);

  const { name } = req.body;
  const code = user.code_list.find((x) => x.file_name === name);

  res.status(200).json({
    code: code.get_code(),
    ...code.get_output(),
  });
});

app.post("/api/code", (req: Request, res: Response) => {
  const user = sessionManager.get_session(
    SessionManager.get_session_token(req)
  ).user;
  console.log(`POST /api/code by ${user.username}`);

  const { code, name } = req.body;
  const code_handler = user.code_list.find((x) => x.file_name === name);
  code_handler.post_code(code);

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  });
});

app.post("/api/session", (req: Request, res: Response) => {
  sessionManager.delete_session(SessionManager.get_session_token(req));
  const { username, password } = req.body;
  const user = userManager.login(username, password);
  if (!user) {
    res.sendStatus(401);
    return;
  }
  const session = sessionManager.create_session(user);

  res.status(200).send({
    username: session.user.username,
    expires: session.expires,
    token: session.token,
  });
});

app.listen(port);
