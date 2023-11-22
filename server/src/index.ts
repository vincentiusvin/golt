import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, {
  Request as OldRequest,
  Response as OldResponse,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { SessionManager } from "./model/Session";
import {
  ICodeGetRequest,
  ICodeGetResponse,
  ICodePostRequest,
  ICodePostResponse,
  ISessionPostRequest,
  ISessionPostResponse,
} from "./shared_interfaces";
import { UserManager } from "./model/User";

type Request<T> = OldRequest<ParamsDictionary, unknown, T>;
type Response<T> = OldResponse<T>;

const app = express();
const port = 3000;
const sessionManager = new SessionManager();
const userManager = new UserManager();

app.use(cookieParser());
app.use(json());

app.get("/api", (req: Request<undefined>, res: Response<string>) => {
  res.status(200).send("API Endpoint :)");
});

app.get(
  "/api/code",
  (req: Request<ICodeGetRequest>, res: Response<ICodeGetResponse>) => {
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
  }
);

app.post(
  "/api/code",
  (req: Request<ICodePostRequest>, res: Response<ICodePostResponse>) => {
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
  }
);

app.post(
  "/api/session",
  (
    req: Request<ISessionPostRequest | undefined>,
    res: Response<ISessionPostResponse>
  ) => {
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
  }
);

app.listen(port);
