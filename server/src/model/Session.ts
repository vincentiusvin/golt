import { randomUUID } from "crypto";
import { Request } from "express";
import { SessionResource } from "../shared_interfaces";
import { db } from "../db";
import moment from "moment";

type SessionFields = {
  id: number;
  token: string;
  user_id: number;
  expire_time: Date;
};

export class Session {
  token: string;
  user_id: number;
  expire_time: Date;

  private constructor(token: string, user_id: number, expire_time: Date) {
    this.token = token;
    this.user_id = user_id;
    this.expire_time = expire_time;
  }

  to_json(): SessionResource {
    return {
      token: this.token,
      expires: this.expire_time,
      user_id: this.user_id,
    };
  }

  static async create_session(user_id: number) {
    const SECONDS = 3600;
    const current_time = new Date().getTime();
    const expiry_time = current_time + SECONDS * 1000;

    const date = new Date(expiry_time);
    const sqlDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    const token = randomUUID();
    await db.query(
      `INSERT INTO sessions(token, user_id, expire_time) VALUES ('${token}', ${user_id}, '${sqlDate}')`
    );
    return await this.get_session(token);
  }

  static async get_session(token: string): Promise<Session | null> {
    const res = await db.query<SessionFields[]>(
      `SELECT token, user_id, expire_time FROM sessions WHERE token = '${token}'`
    );

    if (res.length === 0) {
      return null;
    }

    const session = new Session(
      res[0].token,
      res[0].user_id,
      res[0].expire_time
    );

    if (!session || session.expire_time <= new Date()) {
      this.delete_session(session.token);
      return null;
    }
    return session;
  }

  static async delete_session(token: string) {
    const res = await db.query(`DELETE FROM sessions WHERE token = '${token}'`);
    return res;
  }

  static get_session_token(req: Request): string | null {
    const cookie_str: string | null = req.cookies && req.cookies["session"];
    if (!cookie_str) {
      return null;
    }
    const cookie_obj: SessionResource = JSON.parse(cookie_str);
    return cookie_obj.token;
  }
}
