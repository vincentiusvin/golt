import { db } from "../db";

export class User {
  id: number;
  username: string;
  password: string;
  constructor(id: number) {
    this.id = id;
  }

  static async get_by_id(id: number) {
    const conn = await db.getConnection();
    const res: User[] = await conn.query(
      `SELECT id, name, password FROM users WHERE id = ${id}`
    );
    return res.length ? res[0] : null;
  }
}
