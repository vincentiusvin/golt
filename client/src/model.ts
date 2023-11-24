import { ResponseBody, UserResource } from "./shared_interfaces";

export const getUser = (
  user_id: number
): Promise<ResponseBody<UserResource>> =>
  fetch(`/api/users/${user_id}`, {
    method: "GET",
  }).then((x) => x.json());

export const deleteSession = (): Promise<ResponseBody> =>
  fetch("/api/sessions", { method: "DELETE" }).then((x) => x.json());
