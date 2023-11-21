import { randomUUID } from "crypto";
import { Request } from "express";
import { User } from "./User";

export class SessionManager {
  private sessions: { [token: string]: Session };

  constructor() {
    this.sessions = {};
  }

  add_session(user: User) {
    const session = new Session(user);
    this.sessions[session.token] = session;
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
  user: User;
  expires: Date;
  token: string;

  constructor(user: User) {
    const SECONDS = 3600;
    const current_time = new Date().getTime();
    const expiry_time = current_time + SECONDS * 1000;

    this.expires = new Date(expiry_time);
    this.token = randomUUID();
    this.user = user;
  }
}
