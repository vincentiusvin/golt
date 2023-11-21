export interface ICodeRequest {
  code: string;
  file_name: string;
}

export interface ICodeResponse {
  status: false;
  code: string;
  reason?: string;
}

export interface ISessionRequest {
  username: string;
  password: string;
}

export interface ISessionResponse {
  username: string;
  expires: Date;
  token: string;
}

export type IUserResponse = {
  username: string;
};
