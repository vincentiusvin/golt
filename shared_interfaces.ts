export type CodeResource = {
  id: number;
  display_name: string;
  compile_success: boolean;
  code: string;
  result: string;
};

export type CodeResourceInput = {
  display_name: string;
  code: string;
};

export type SessionResource = {
  expires: Date;
  token: string;
  user_id: number;
};

export type SessionResourceInput = {
  display_name: string;
  password: string;
};

export type UserResource = {
  id: number;
  display_name: string;
};

export type UserResourceInput = {
  display_name: string;
  password: string;
};

export type Collection<T> = { resources: T[] };

export type ResponseBody<T = void> =
  | {
      success: false;
      message: string;
    }
  | (T extends void ? { success: true } : { success: true } & T);
