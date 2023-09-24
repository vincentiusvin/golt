export type incoming_request = {
    code: string;
} | undefined;

export type outgoing_request = {
    status: true;
    code: string;
} | {
    status: false;
    reason: string;
}
