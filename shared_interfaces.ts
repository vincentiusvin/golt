export enum CodeStatus {
  Success,
  CompileError,
}

export type ICodeResourceGetResponse = {
  id: number;
  display_name: string;
  status: CodeStatus;
  code: string;
  result: string;
};
export type ICodeCollectionGetResponse = ICodeResourceGetResponse[];

export type ICodeResourcePutRequest = {
  code: string;
};

export type ICodeCollectionPostRequest = {
  display_name: string;
  code: string;
};

export type ISessionCollectionPostRequest = {
  display_name: string;
  password: string;
};

export type ISessionCollectionPostResponse = {
  user_id: number;
  display_name: string;
  expires: Date;
  token: string;
};

export type IUserCollectionPostRequest = {
  display_name: string;
  password: string;
};

export type IUserResourceGetResponse = {
  id: number;
  display_name: string;
};
