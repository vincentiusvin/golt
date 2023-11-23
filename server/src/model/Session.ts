import { randomUUID } from "crypto";
import { Request } from "express";

export class SessionManager {
  private sessions: { [token: string]: Session };

  constructor() {
    this.sessions = {};
  }

  create_session(user_id: number) {
    const session = new Session(user_id);
    this.sessions[session.token] = session;
    return session;
  }

  get_session(token: string): Session | null {
    const session = this.sessions[token];
    if (!session) {
      return null;
    }
    if (session.expires <= new Date()) {
      delete this.sessions[session.token];
      return null;
    }
    return this.sessions[token];
  }

  delete_session(token: string) {
    const session = this.sessions[token];
    if (!session) {
      return null;
    }
    delete this.sessions[token];
  }

  static get_session_token(req: Request): string | null {
    return req.cookies && req.cookies["session_token"];
  }
}

export class Session {
  user_id: number;
  expires: Date;
  token: string;

  constructor(user_id: number) {
    const SECONDS = 3600;
    const current_time = new Date().getTime();
    const expiry_time = current_time + SECONDS * 1000;

    this.expires = new Date(expiry_time);
    this.token = randomUUID();
    this.user_id = user_id;
  }
}
