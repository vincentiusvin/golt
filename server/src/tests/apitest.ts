import { log } from "console";
import {
  ICodeCollectionGetResponse,
  ICodeCollectionPostRequest,
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
  IUserCollectionPostRequest,
  IUserCollectionPostResponse,
} from "../shared_interfaces";

const sessionBody: IUserCollectionPostRequest | ISessionCollectionPostRequest =
  {
    name: "ucok",
    password: "123",
  };

const codeBody: ICodeCollectionPostRequest = {
  name: "apitest",
  code: `\
#include <stdio.h>

int main(){
    printf("hi");
}
`,
};

const fn = async () => {
  const reg = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionBody),
  });
  const reg_resp: IUserCollectionPostResponse = await reg.json();
  log(reg_resp);

  const login = await fetch("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionBody),
  });
  const login_resp: ISessionCollectionPostResponse = await login.json();
  log(login_resp);

  const addcode = await fetch(
    `http://localhost:3000/api/users/${login_resp.name}/codes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_token=${login_resp.token}`,
      },
      body: JSON.stringify(codeBody),
    }
  );
  const code: ICodeCollectionGetResponse = await addcode.json();
  log(code);
};

fn();
