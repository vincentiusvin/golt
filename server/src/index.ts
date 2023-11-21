import { json } from "body-parser";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { SessionManager } from "./model/Session";
import { ICodeRequest, ICodeResponse } from "./shared_interfaces";

const app = express();
const port = 3000;
const sessionManager = new SessionManager();

app.use(cookieParser());
app.use(json());

app.get("/api", (req: Request, res: Response) => {
  res.send("API Endpoint :)");
});

app.get("/api/code", (req: Request, res: Response) => {
  const user = sessionManager.get_session(
    SessionManager.get_session_token(req)
  ).user;
  console.log(`/api/code get by ${user.username}`);
  const body: ICodeRequest = req.body;
  const file = body.file_name;
  const code = user.code_list.find((x) => x.name === file);

  const response: ICodeResponse = {};
  res.status(200).json();
});

app.post("/api/code", (req: Request, res: Response) => {});

app.get("/api/session", (req: Request, res: Response) => {});

app.post("/api/session", (req: Request, res: Response) => {});

app.delete("/api/session", (req: Request, res: Response) => {});

app.listen(port);
