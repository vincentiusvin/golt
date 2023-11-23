import { NextFunction, Request } from "express";
import { Code } from "../model/Code";
import {
  ICodeCollectionGetResponse,
  ICodeCollectionPostRequest,
  ICodeResourceGetResponse,
  ICodeResourcePutRequest,
} from "../shared_interfaces";
import { CodeResponse, UserResponse } from "../types";

export const CodeMiddleware = async (
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
  const response = codes.map((x) => ({
    code: x.get_code(),
    ...x.get_output(),
  }));

  res.status(200).json(response as ICodeCollectionGetResponse);
};

export const CodeCollectionPost = async (req: Request, res: UserResponse) => {
  const { code, name } = req.body as ICodeCollectionPostRequest;
  const user_id = res.locals.user.id;

  await Code.add_to_db(name, user_id);
  const code_handler = await Code.get_by_user_id_and_name(user_id, name);
  if (!code_handler) {
    throw new Error("Code handler not found after being added to the DB!");
  }

  code_handler.post_code(code);

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};

export const CodeResourceGet = (req: Request, res: CodeResponse) => {
  const code_handler = res.locals.code;

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};

export const CodeResourcePut = (req: Request, res: CodeResponse) => {
  const code_handler = res.locals.code;
  const { code } = req.body as ICodeResourcePutRequest;
  code_handler.post_code(code);

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};
