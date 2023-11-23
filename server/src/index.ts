import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, {
  NextFunction,
  Request as OldRequest,
  Response,
} from "express";
import { Code } from "./model/Code";
import { SessionManager } from "./model/Session";
import { User } from "./model/User";
import {
  CodeCollectionGet,
  CodeCollectionPost,
  CodeMiddleware,
  CodeResourceGet,
} from "./routes/code";
import { SessionCollectionPost, SessionMiddleware } from "./routes/session";
import { UserAuthMiddleware } from "./routes/user";

const app = express();
const port = 3000;
const sessionManager = new SessionManager();

interface Request extends OldRequest {
  user?: User; // authenticated user
  code?: Code; // code handler
}
const LoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const msg =
    `${req.method} ${req.originalUrl}` +
    (req.user ? ` by ${req.user.name}` : "");
  console.log(msg);
  next();
};

app.use(cookieParser());
app.use((...args) => SessionMiddleware(sessionManager, ...args));
app.use(LoggerMiddleware);
app.use(json());

app.get("/api", (req, res) => {
  res.status(200).send("API Endpoint :)");
});

app.all("/api/users/:userID/*", UserAuthMiddleware);
app.get("/api/users/:userID/codes", CodeCollectionGet);
app.post("/api/users/:userID/codes", CodeCollectionPost);
app.all("/api/users/:userID/codes/:codeID", CodeMiddleware);
app.get("/api/users/:userID/codes/:codeID", CodeResourceGet);
app.put("/api/users/:userID/codes/:codeID", CodeCollectionPost);

app.post("/api/sessions", (...args) =>
  SessionCollectionPost(sessionManager, ...args)
);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
