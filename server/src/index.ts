import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, {
  Request as OldRequest,
  Response as OldResponse,
} from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { SessionManager } from "./model/Session";
import { User } from "./model/User";
import {
  ICodeGetRequest,
  ICodeGetResponse,
  ICodePostRequest,
  ICodePostResponse,
  ISessionGetRequest,
  ISessionGetResponse,
  ISessionPostRequest,
  ISessionPostResponse,
} from "./shared_interfaces";

type Request<T> = OldRequest<ParamsDictionary, unknown, T>;
type Response<T> = OldResponse<T>;

const app = express();
const port = 3000;
const sessionManager = new SessionManager();

app.use(cookieParser());
app.use(json());

app.get("/api", (req: Request<undefined>, res: Response<string>) => {
  res.send("API Endpoint :)");
});

app.get(
  "/api/code",
  (req: Request<ICodeGetRequest>, res: Response<ICodeGetResponse>) => {
    const user = sessionManager.get_session(
      SessionManager.get_session_token(req)
    ).user;
    console.log(`GET /api/code by ${user.username}`);

    const { name } = req.body;
    const code = user.code_list.find((x) => x.name === name);

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
    const code_handler = user.code_list.find((x) => x.name === name);
    code_handler.post_code(code);

    res.status(200).json({
      code: code_handler.get_code(),
      ...code_handler.get_output(),
    });
  }
);

app.post(
  "/api/session",
  (req: Request<ISessionPostRequest>, res: Response<ISessionPostResponse>) => {
    sessionManager.delete_session(SessionManager.get_session_token(req));
    const { username, password } = req.body;
    sessionManager;
  }
);

app.delete("/api/session", (req: Request, res: Response) => {});

app.listen(port);
