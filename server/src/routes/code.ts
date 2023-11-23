import { NextFunction, Request } from "express";
import { Code } from "../model/Code";
import {
  ICodeCollectionPostRequest,
  ICodeResourceGetResponse,
  ICodeResourcePutRequest,
} from "../shared_interfaces";
import { CodeResponse, UserResponse } from "../types";

export const CodeAuthMiddleware = async (
  req: Request,
  res: UserResponse,
  next: NextFunction
) => {
  const code_id = Number(req.params["codeID"]);
  const code_handler = await Code.get_by_user_id_and_code_id(
    res.locals.user.id,
    code_id
  );

  if (!code_handler) {
    res.sendStatus(404);
    return;
  }

  res.locals.code = code_handler;
  next();
};

export const CodeCollectionGet = async (req: Request, res: UserResponse) => {
  const codes = await res.locals.user.get_codes();

  const response: ICodeResourceGetResponse[] = codes.map((code_handler) => ({
    code: code_handler.get_code(),
    id: code_handler.id,
    display_name: code_handler.name,
    ...code_handler.get_output(),
  }));
  res.status(200).json(response);
};

export const CodeCollectionPost = async (req: Request, res: UserResponse) => {
  const { code, display_name } = req.body as ICodeCollectionPostRequest;
  const user_id = res.locals.user.id;

  await Code.add_to_db(display_name, user_id);
  const code_handler = await Code.get_by_user_id_and_name(
    user_id,
    display_name
  );
  if (!code_handler) {
    throw new Error("Code handler not found after being added to the DB!");
  }

  code_handler.post_code(code);

  const response: ICodeResourceGetResponse = {
    code: code_handler.get_code(),
    id: code_handler.id,
    display_name: code_handler.name,
    ...code_handler.get_output(),
  };
  res.status(200).json(response);
};

export const CodeResourceGet = (req: Request, res: CodeResponse) => {
  const code_handler = res.locals.code;

  const response: ICodeResourceGetResponse = {
    code: code_handler.get_code(),
    id: code_handler.id,
    display_name: code_handler.name,
    ...code_handler.get_output(),
  };
  res.status(200).json(response);
};

export const CodeResourcePut = (req: Request, res: CodeResponse) => {
  const code_handler = res.locals.code;
  const { code } = req.body as ICodeResourcePutRequest;
  code_handler.post_code(code);

  const response: ICodeResourceGetResponse = {
    code: code_handler.get_code(),
    id: code_handler.id,
    display_name: code_handler.name,
    ...code_handler.get_output(),
  };
  res.status(200).json(response);
};
