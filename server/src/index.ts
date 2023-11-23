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
  ICodesGetResponse,
  ISessionPostRequest,
  ISessionPostResponse,
} from "./shared_interfaces";
import { User } from "./model/User";
import { Code } from "./model/Code";

const app = express();
const port = 3000;
const sessionManager = new SessionManager();

app.use(cookieParser());

interface Request extends OldRequest {
  user?: User; // authenticated user id
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const session = sessionManager.get_session(
    SessionManager.get_session_token(req)
  );
  if (session) {
    req.user = await User.get_by_id(session.user_id);
  }
  next();
};
app.use(auth);

const logger = (req: Request, res: Response, next: NextFunction) => {
  const msg =
    `${req.method} ${req.originalUrl}` +
    (req.user ? ` by ${req.user.name}` : "");
  console.log(msg);
  next();
};
app.use(logger);

app.use(json());

app.get("/api", (req, res) => {
  res.status(200).send("API Endpoint :)");
});

app.get(
  "/api/users/:userID/*",
  (req: Request, res: Response, next: NextFunction) => {
    const userID = Number(req.params["userID"]);
    if (!req.user || req.user.id !== userID) {
      res.send(401);
    } else {
      next();
    }
  }
);

app.get("/api/users/:userID/codes", async (req: Request, res: Response) => {
  const codes = await req.user.get_codes();
  const response = codes.map((x) => ({
    code: x.get_code(),
    ...x.get_output(),
  }));

  res.status(200).json(response as ICodesGetResponse);
});

app.get(
  "/api/users/:userID/codes/:codeID",
  async (req: Request, res: Response) => {
    const code_id = Number(req.params["codeID"]);
    const code_handler = await Code.get_by_user_id_and_code_id(
      req.user.id,
      code_id
    );

    res.status(200).json({
      code: code_handler.get_code(),
      ...code_handler.get_output(),
    } as ICodeGetResponse);
  }
);

app.get(
  "/api/users/:userID/codes/:codeID",
  async (req: Request, res: Response) => {
    const codeID = Number(req.params["codeID"]);
    const codes = await req.user.get_codes();
    const code_handler = codes.find((x) => x.id === codeID);

    res.status(200).json({
      code: code_handler.get_code(),
      ...code_handler.get_output(),
    } as ICodeGetResponse);
  }
);

app.post(
  "/api/users/:userID/codes/:codeID",
  async (req: Request, res: Response) => {
    const { code } = req.body as ICodePostRequest;
    const codeID = Number(req.params["codeID"]);
    const codes = await req.user.get_codes();
    const code_handler = codes.find((x) => x.id === codeID);

    code_handler.post_code(code);

    res.status(200).json({
      code: code_handler.get_code(),
      ...code_handler.get_output(),
    } as ICodePostResponse);
  }
);

app.post("/api/session", async (req: Request, res: Response) => {
  sessionManager.delete_session(SessionManager.get_session_token(req));
  const { name, password } = req.body as ISessionPostRequest;

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
  } as ISessionPostResponse);
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
