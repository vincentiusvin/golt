import { NextFunction, Request as OldRequest, Response } from "express";
import { Code } from "../model/Code";
import { User } from "../model/User";
import {
  ICodeCollectionGetResponse,
  ICodeCollectionPostRequest,
  ICodeResourceGetResponse,
  ICodeResourcePutRequest,
} from "../shared_interfaces";

interface Request extends OldRequest {
  user?: User; // authenticated user
  code?: Code; // authenticated user
}

export const CodeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const code_id = Number(req.params["codeID"]);
  const code_handler = await Code.get_by_user_id_and_code_id(
    req.user.id,
    code_id
  );

  if (!code_handler) {
    res.sendStatus(404);
    return;
  }

  req.code = code_handler;
  next();
};

export const CodeCollectionGet = async (req: Request, res: Response) => {
  const codes = await req.user.get_codes();
  const response = codes.map((x) => ({
    code: x.get_code(),
    ...x.get_output(),
  }));

  res.status(200).json(response as ICodeCollectionGetResponse);
};

export const CodeCollectionPost = async (req: Request, res: Response) => {
  const { code, name } = req.body as ICodeCollectionPostRequest;
  const user_id = req.user.id;

  await Code.add_to_db(name, user_id);
  const code_handler = await Code.get_by_user_id_and_name(user_id, name);
  code_handler.post_code(code);

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};

export const CodeResourceGet = async (req: Request, res: Response) => {
  const code_handler = req.code;

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};

export const CodeResourcePut = async (req: Request, res: Response) => {
  const code_handler = req.code;
  const { code } = req.body as ICodeResourcePutRequest;
  code_handler.post_code(code);

  res.status(200).json({
    code: code_handler.get_code(),
    ...code_handler.get_output(),
  } as ICodeResourceGetResponse);
};
