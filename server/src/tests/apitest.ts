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
    name: "abcd",
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

  let reg_resp: IUserCollectionPostResponse;
  try {
    reg_resp = await reg.clone().json();
    log(reg_resp);
  } catch (error) {
    log(await reg.text());
    return;
  }

  const login = await fetch("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionBody),
  });

  let login_resp: ISessionCollectionPostResponse;
  try {
    login_resp = await login.clone().json();
    log(login_resp);
  } catch (error) {
    log(await login.text());
    return;
  }

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
  try {
    const code: ICodeCollectionGetResponse = await addcode.clone().json();
    log(code);
  } catch (error) {
    log(await addcode.text());
  }
};

fn();
