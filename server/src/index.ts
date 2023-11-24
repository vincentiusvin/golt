import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import {
  CodeAuthMiddleware,
  CodeCollectionGet,
  CodeCollectionPost,
  CodeResourceGet,
  CodeResourcePut,
} from "./routes/code";
import { LoggerMiddleware } from "./routes/logger";
import {
  SessionCollectionDelete,
  SessionCollectionPost,
  SessionMiddleware,
} from "./routes/session";
import {
  UserAuthMiddleware,
  UserCollectionsPost,
  UserResourceGet,
} from "./routes/user";
import { Response } from "./types";

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(SessionMiddleware);
app.use(LoggerMiddleware);
app.use(json());

app.get("/api", (req, res: Response) => {
  res.status(200).send({ success: false, message: "Hello world!" });
});

app.post("/api/users", UserCollectionsPost);
app.all("/api/users/:userID*", UserAuthMiddleware);
app.get("/api/users/:userID", UserResourceGet);
app.get("/api/users/:userID/codes", CodeCollectionGet);
app.post("/api/users/:userID/codes", CodeCollectionPost);
app.all("/api/users/:userID/codes/:codeID*", CodeAuthMiddleware);
app.get("/api/users/:userID/codes/:codeID", CodeResourceGet);
app.put("/api/users/:userID/codes/:codeID", CodeResourcePut);
app.post("/api/sessions", SessionCollectionPost);
app.delete("/api/sessions", SessionCollectionDelete);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
