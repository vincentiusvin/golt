import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request } from "express";
import { SessionManager } from "./model/Session";
import {
  CodeAuthMiddleware,
  CodeCollectionGet,
  CodeCollectionPost,
  CodeResourceGet,
  CodeResourcePut,
} from "./routes/code";
import { SessionCollectionPost, SessionMiddleware } from "./routes/session";
import {
  UserAuthMiddleware,
  UserCollectionsPost,
  UserResourceGet,
} from "./routes/user";
import { LoggerMiddleware } from "./routes/logger";

const app = express();
const port = 3000;
const sessionManager = new SessionManager();

app.use(cookieParser());
app.use((...args) => SessionMiddleware(sessionManager, ...args));
app.use(LoggerMiddleware);
app.use(json());

app.get("/api", (req, res) => {
  res.status(200).send("API Endpoint :)");
});

app.post("/api/users", UserCollectionsPost);
app.all("/api/users/:userID*", UserAuthMiddleware);
app.get("/api/users/:userID", UserResourceGet);
app.get("/api/users/:userID/codes", CodeCollectionGet);
app.post("/api/users/:userID/codes", CodeCollectionPost);
app.all("/api/users/:userID/codes/:codeID*", CodeAuthMiddleware);
app.get("/api/users/:userID/codes/:codeID", CodeResourceGet);
app.put("/api/users/:userID/codes/:codeID", CodeResourcePut);
app.post("/api/sessions", (...args) =>
  SessionCollectionPost(sessionManager, ...args)
);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
