export enum CodeStatus {
  Success,
  CompileError,
}

export type ICodeGetResponse = {
  status: CodeStatus;
  code: string;
  result: string;
};

export type ICodesGetResponse = {
  status: CodeStatus;
  code: string;
  result: string;
}[];

export type ICodePostRequest = {
  code: string;
};

export type ICodePostResponse = {
  status: CodeStatus;
  code: string;
  result: string;
};

export type ISessionPostRequest = {
  name: string;
  password: string;
};

export type ISessionPostResponse = {
  name: number;
  expires: Date;
  token: string;
};
