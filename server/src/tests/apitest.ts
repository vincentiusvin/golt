import {
  CodeResource,
  CodeResourceInput,
  ResponseBody,
  SessionResource,
  SessionResourceInput,
  UserResource,
  UserResourceInput,
} from "../shared_interfaces";

type PR<T> = Promise<ResponseBody<T>>;

const register = async (body: UserResourceInput): PR<UserResource> => {
  return await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

const login = async (body: SessionResourceInput): PR<SessionResource> => {
  return await fetch("http://localhost:3000/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

const add_code = async (
  body: CodeResourceInput,
  prev: SessionResource
): PR<CodeResource> => {
  return await fetch(`http://localhost:3000/api/users/${prev.user_id}/codes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_token=${prev.token}`,
    },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

const view_codes = async (prev: SessionResource): PR<CodeResource[]> => {
  return await fetch(`http://localhost:3000/api/users/${prev.user_id}/codes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_token=${prev.token}`,
    },
  }).then((x) => x.json());
};

const user: UserResourceInput = {
  display_name: "abcd",
  password: "123",
};

const code: CodeResourceInput = {
  display_name: "apitest",
  code: `\
#include <stdio.h>

int main(){
    printf("hi");
}
`,
};

let session: SessionResource;

register(user)
  .then((x) => {
    console.log(x);
    return login(user);
  })
  .then((x) => {
    console.log(x);
    if (x.success === false) {
      throw new Error(x.message);
    }
    session = x;
    return add_code(code, x);
  })
  .then((x) => {
    console.log(x);
    return view_codes(session);
  })
  .then(console.log);
