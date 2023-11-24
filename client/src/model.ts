import {
  ResponseBody,
  SessionResource,
  SessionResourceInput,
  UserResource,
  UserResourceInput,
} from "./shared_interfaces";

export const getUser = (
  user_id: number
): Promise<ResponseBody<UserResource>> =>
  fetch(`/api/users/${user_id}`, {
    method: "GET",
  }).then((x) => x.json());

export const deleteSession = (): Promise<ResponseBody> =>
  fetch("/api/sessions", { method: "DELETE" }).then((x) => x.json());

export const getSession = (
  display_name: string,
  password: string
): Promise<ResponseBody<SessionResource>> => {
  const body: SessionResourceInput = {
    display_name: display_name,
    password: password,
  };

  return fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

export const addUser = (
  display_name: string,
  password: string
): Promise<ResponseBody<SessionResource>> => {
  const body: UserResourceInput = {
    display_name: display_name,
    password: password,
  };
  return fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};
