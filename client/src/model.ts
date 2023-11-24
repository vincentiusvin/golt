import {
  CodeResource,
  CodeResourceInput,
  Collection,
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

export const getCodes = (
  user_id: number
): Promise<ResponseBody<Collection<CodeResource>>> =>
  fetch(`/api/users/${user_id}/codes`).then((x) => x.json());

export const getCode = (user_id: number, code_id: number) =>
  fetch(`/api/users/${user_id}/codes/${code_id}`).then((x) =>
    x.json()
  );

export const putCode = (
  user_id: number,
  code_id: number,
  code: string,
  display_name: string
): Promise<ResponseBody<CodeResource>> => {
  const body: CodeResourceInput = {
    code: code,
    display_name: display_name,
  };
  return fetch(`/api/users/${user_id}/codes/${code_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

export const addCode = (
  user_id: string,
  code: string,
  display_name: string
): Promise<ResponseBody<CodeResource>> => {
  const body: CodeResourceInput = {
    code: code,
    display_name: display_name,
  };
  return fetch(`/api/users/${user_id}/codes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then((x) => x.json());
};

export const deleteCode = (
  user_id: string,
  code_id: number
): Promise<ResponseBody> => {
  return fetch(`/api/users/${user_id}/codes/${code_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  }).then((x) => x.json());
};
