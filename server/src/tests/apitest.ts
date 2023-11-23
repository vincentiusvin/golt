import { log } from "console";
import {
  ICodeCollectionGetResponse,
  ICodeCollectionPostRequest,
  ISessionCollectionPostRequest,
  ISessionCollectionPostResponse,
} from "../shared_interfaces";

const sessionBody: ISessionCollectionPostRequest = {
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
  const res = await fetch("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionBody),
  });
  const auth: ISessionCollectionPostResponse = await res.json();
  log(auth);

  const res2 = await fetch(
    `http://localhost:3000/api/users/${auth.name}/codes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_token=${auth.token}`,
      },
      body: JSON.stringify(codeBody),
    }
  );
  const code: ICodeCollectionGetResponse = await res2.json();
  log(code);
};

fn();
