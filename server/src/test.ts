import { log } from "console";
import {
  ICodePostRequest,
  ICodePostResponse,
  ISessionPostRequest,
  ISessionPostResponse,
} from "./shared_interfaces";

const sessionBody: ISessionPostRequest = {
  username: "Udin",
  password: "123",
};

const codeBody: ICodePostRequest = {
  code: `\
#include <stdio.h>

int main(){
    printf("hi");
}
`,
  name: "test",
};

const fn = async () => {
  const res = await fetch("http://localhost:3000/api/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionBody),
  });
  const auth: ISessionPostResponse = await res.json();
  log(auth);

  const res2 = await fetch("http://localhost:3000/api/code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_token=${auth.token}`,
    },
    body: JSON.stringify(codeBody),
  });
  const code: ICodePostResponse = await res2.json();
  log(code);
};

fn();
