import { json } from "body-parser";
import express, { Request, Response } from "express";
import { exec } from "node:child_process";
import * as fs from "node:fs/promises";
import { UserCode, DisasmResult, Login, Session } from "./shared_interfaces";
import { randomUUID } from "node:crypto";
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;
app.use(cookieParser());
app.use(json());
const sessions: { [token: string]: Session } = {};
const makeNewSession = (username: string) => {
  const token = randomUUID();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);
  sessions[token] = { username: username, expires: expires, token: token };
  return sessions[token];
};

app.get("/api", (req: Request, res: Response) => {
  res.send("API Endpoint :)");
});

app.get("/api/code", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;
  console.log(`/api/code get by ${session?.username}`)
  if (!session && token) {
    res.status(403).send();
  } else {
    fs.readFile("compile/a.cpp", "utf-8").then((val) => {
      const reply: UserCode = { code: val };
      res.status(200).json(reply);
    });
  }
});

app.post("/api/compile", (req: Request, res: Response) => {
  const body: UserCode = req.body;
  console.log(`/api/compile post with ${body}`)
  if (!body) {
    res.sendStatus(400);
  }
  fs.writeFile("compile/a.cpp", body.code)
    .then(() => {
      let reply: DisasmResult;
      exec("gcc -g compile/a.cpp -o compile/a.out", (err) => {
        if (err) {
          reply = { status: false, reason: err.message };
          res.status(200).json(reply);
        } else {
          exec(
            "objdump -DrwCS -j .text -j .plt -j .rodata compile/a.out",
            (err, out) => {
              if (err) {
                reply = { status: false, reason: err.message };
                res.status(200).json(reply);
              } else {
                fs.writeFile("compile/compiled.txt", out).then(() => {
                  reply = { status: true, code: out };
                  res.status(201).json(reply);
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

app.get("/api/user", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;
  console.log(`/api/user get by ${session?.username}`)
  if (session && session.expires >= new Date()) {
    const username = session["username"];
    res.status(200).json({ username: username });
  }
});

app.get("/api/session", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;
  console.log(`/api/session get by ${session?.username}`)
  if (session && session.expires >= new Date()) {
    res.status(201).json(makeNewSession(session.username));
    delete sessions[token];
  }
});

app.post("/api/session", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;

  console.log(`/api/session post by ${session?.username}`)
  if (session) {
    delete sessions[token];
  }
  res.status(201).json(makeNewSession("1"));
});

app.delete("/api/session", (req: Request, res: Response) => {
  const token: string = (req.cookies && req.cookies["session_token"]) || null;
  const session = token ? sessions[token] : null;

  console.log(`/api/session del by ${session?.username}`)
  if (token) {
    delete sessions[token];
    res.redirect("/");
  } else {
    res.sendStatus(401);
  }
});

app.listen(port);
