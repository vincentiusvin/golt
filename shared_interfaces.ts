export enum CodeStatus {
  Success,
  CompileError,
}

export type ICodeGetRequest = {
  code: string;
  name: string;
};

export type ICodeGetResponse = {
  status: CodeStatus;
  code: string;
  result: string;
};

export type ICodePostRequest = {
  code: string;
  name: string;
};

export type ICodePostResponse = {
  status: CodeStatus;
  code: string;
  result: string;
};

export type ISessionPostRequest = {
  username: string;
  password: string;
};

export type ISessionPostResponse = {
  username: string;
  expires: Date;
  token: string;
};

export type IUserResponse = {
  username: string;
};
