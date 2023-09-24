import { json } from "body-parser";
import express, { Request, Response } from "express";
import { exec } from "node:child_process";
import * as fs from "node:fs/promises";
import { incoming_request, outgoing_request } from "./shared_interfaces";
const app = express();
const port = 3000;
app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("API Endpoint :)");
});

app.post("/api/compile", (req: Request, res: Response) => {
  const body: incoming_request = req.body;
  console.log(body);
  if (!body) {
    res.sendStatus(400);
  }
  fs.writeFile("compile/a.cpp", body.code)
    .then(() => {
      let reply: outgoing_request;
      exec("gcc -g compile/a.cpp -o compile/a.out", (err) => {
        if (err) {
          reply = { status: false, reason: err.message };
          res.status(200).json(reply).send();
        } else {
          exec("objdump -drwCS compile/a.out", (err, out) => {
            if (err) {
              reply = { status: false, reason: err.message };
              res.status(200).json(reply).send();
            } else {
              fs.writeFile("compile/compiled.txt", out).then(() => {
                reply = { status: true, code: out };
                res.status(201).json(reply).send();
              });
            }
          });
        }
      });
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

app.listen(port);
