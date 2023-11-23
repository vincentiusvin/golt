import { log } from "console";
import {
  ICodeCollectionPostRequest,
  ICodeResourceGetResponse,
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
  IUserCollectionPostRequest,
  IUserResourceGetResponse,
} from "../shared_interfaces";

const sessionBody: IUserCollectionPostRequest | ISessionCollectionPostRequest =
  {
    display_name: "abcd",
    password: "123",
  };

const codeBody: ICodeCollectionPostRequest = {
  display_name: "apitest",
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

  let reg_resp: IUserResourceGetResponse;
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

  let code: ICodeResourceGetResponse;
  const addcode = await fetch(
    `http://localhost:3000/api/users/${login_resp.user_id}/codes`,
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
    code = await addcode.clone().json();
    log(code);
  } catch (error) {
    log(await addcode.text());
    return;
  }

  const viewcode = await fetch(
    `http://localhost:3000/api/users/${login_resp.user_id}/codes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_token=${login_resp.token}`,
      },
      // body: JSON.stringify(codeBody),
    }
  );
  try {
    code = await viewcode.clone().json();
    log(code);
  } catch (error) {
    log(await viewcode.text());
  }
};

fn();
