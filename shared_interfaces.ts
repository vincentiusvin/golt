export enum CodeStatus {
  Success,
  CompileError,
}

export type ICodeResourceGetResponse = {
  name: number;
  status: CodeStatus;
  code: string;
  result: string;
};
export type ICodeCollectionGetResponse = ICodeResourceGetResponse[];

export type ICodeResourcePutRequest = {
  code: string;
};

export type ICodeCollectionPostRequest = {
  name: string;
  code: string;
};

export type ISessionCollectionPostRequest = {
  name: string;
  password: string;
};

export type ISessionCollectionPostResponse = {
  name: number;
  expires: Date;
  token: string;
};
