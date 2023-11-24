import { NextFunction } from "express";
import { Code } from "../model/Code";
import { CodeResponse, Request, UserResponse } from "../types";
import {
  CodeResource,
  CodeResourceInput,
  Collection,
} from "../shared_interfaces";

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
    res.status(404).send({ success: false, message: "Unauthorized!" });
    return;
  }

  res.locals.code = code_handler;
  next();
};

export const CodeCollectionGet = async (
  req: Request,
  res: UserResponse<Collection<CodeResource>>
) => {
  const codes = await res.locals.user.get_codes();

  res
    .status(200)
    .json({ success: true, resources: codes.map((x) => x.to_json()) });
};

export const CodeCollectionPost = async (
  req: Request<CodeResourceInput>,
  res: UserResponse<CodeResource>
) => {
  const { code, display_name } = req.body;
  const user_id = res.locals.user.id;
  if (display_name.length === 0) {
    res.status(401).json({
      success: false,
      message: "Name cannot be empty!",
    });
    return;
  }

  if (
    (await res.locals.user.get_codes()).find((x) => x.name === display_name)
  ) {
    res.status(401).json({
      success: false,
      message: "You already have another code with this name!",
    });
    return;
  }

  await Code.add_to_db(display_name, user_id);
  const code_handler = await Code.get_by_user_id_and_name(
    user_id,
    display_name
  );
  if (!code_handler) {
    res.status(500).json({ success: false, message: "Internal server error!" });
    return;
  }

  code_handler.post_code(code);

  res.status(200).json({ success: true, ...code_handler.to_json() });
};

export const CodeResourceGet = (
  req: Request,
  res: CodeResponse<CodeResource>
) => {
  const code_handler = res.locals.code;

  res.status(200).json({ success: true, ...code_handler.to_json() });
};

export const CodeResourceDelete = async (req: Request, res: CodeResponse) => {
  const code_handler = res.locals.code;
  await code_handler.delete_code();
  res.status(200).json({ success: true });
};

export const CodeResourcePut = (
  req: Request<CodeResourceInput>,
  res: CodeResponse<CodeResource>
) => {
  const code_handler = res.locals.code;
  const { code } = req.body;
  code_handler.post_code(code);

  res.status(200).json({ success: true, ...code_handler.to_json() });
};
