import { json } from "body-parser";
import express, { Request, Response } from "express";
import { exec } from "node:child_process";
import * as fs from "node:fs/promises";
import { UserCode, DisasmResult, Login } from "./shared_interfaces";
import { randomUUID } from "node:crypto";
const app = express();
const port = 3000;

app.use(json());

app.get("/api", (req: Request, res: Response) => {
  res.send("API Endpoint :)");
});

app.post("/api/compile", (req: Request, res: Response) => {
  const body: UserCode = req.body;
  console.log(body);
  if (!body) {
    res.sendStatus(400);
  }
  fs.writeFile("compile/a.cpp", body.code)
    .then(() => {
      let reply: DisasmResult;
      exec("gcc -g compile/a.cpp -o compile/a.out", (err) => {
        if (err) {
          reply = { status: false, reason: err.message };
          res.status(200).json(reply).send();
        } else {
          exec(
            "objdump -DrwCS -j .text -j .plt -j .rodata compile/a.out",
            (err, out) => {
              if (err) {
                reply = { status: false, reason: err.message };
                res.status(200).json(reply).send();
              } else {
                fs.writeFile("compile/compiled.txt", out).then(() => {
                  reply = { status: true, code: out };
                  res.status(201).json(reply).send();
                });
              }
            }
          );
        }
      });
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

type Session = {
  uid: string;
  expire: Date;
};

const sessions: { [token: string]: Session } = {};

const makeNewSession: (uid: string) => [string, Session] = (uid: string) => {
  const token = randomUUID();
  const expire = new Date(new Date().getTime() + 60 * 60 * 1000);
  sessions[token] = { uid: uid, expire: expire };
  return [token, sessions[token]];
};

app.post("/session", (req: Request, res: Response) => {
  const authenticate = (uid: string) => {
    const [token, session] = makeNewSession(uid);
    res
      .cookie("session_token", token, { expires: session.expire })
      .status(401)
      .send();
  };

  const login = () => {
    const body: Login = req.body;
    if (body && body.username === "udin" && body.password === "1234") {
      authenticate("1");
    }
  };

  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;

  if (session) {
    if (session.expire <= new Date()) {
      authenticate(sessions[token].uid);
    } else {
      login();
    }
    delete sessions[token];
  } else {
    login();
  }
});

app.delete("/session", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  if (token) {
    delete sessions[token];
    res.redirect("/");
  }
  else{
    res.sendStatus(401);
  }
});

app.listen(port);
