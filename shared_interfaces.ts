export type UserCode = {
    code: string;
} | undefined;

export type DisasmResult = {
    status: true;
    code: string;
} | {
    status: false;
    reason: string;
}

export type Login = {
    username: string;
    password: string;
}

export type Session = {
    uid: string;
    expires: Date;
    token: string;
}
