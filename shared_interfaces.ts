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
