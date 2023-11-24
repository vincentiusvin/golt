import { db } from "../db";
import { UserResource } from "../shared_interfaces";
import { Code } from "./Code";

type UserFields = {
  id: number;
  name: string;
  password: string;
};

export class User {
  id: number;
  name: string;
  password: string;

  private constructor(id: number, name: string, password: string) {
    this.id = id;
    this.name = name;
    this.password = password;
  }

  async get_codes() {
    return await Code.get_by_user_id(this.id);
  }

  async add_code(code_name: string) {
    return await Code.add_to_db(code_name, this.id);
  }

  to_json(): UserResource {
    return {
      id: this.id,
      display_name: this.name,
    };
  }

  static async get_by_id(id: number): Promise<User | null> {
    const res = await db.query<UserFields[]>(
      `SELECT id, name, password FROM users WHERE id = ${id};`
    );
    return res.length
      ? new User(res[0].id, res[0].name, res[0].password)
      : null;
  }

  static async add_to_db(name: string, password: string) {
    const res = await db.query(
      `INSERT INTO users(name, password) VALUES ('${name}', '${password}');`
    );
    return res;
  }

  static async get_by_name(name: string): Promise<User | null> {
    const res = await db.query<UserFields[]>(
      `SELECT id, name, password FROM users WHERE name = '${name}';`
    );
    return res.length
      ? new User(res[0].id, res[0].name, res[0].password)
      : null;
  }

  static async login(name: string, password: string): Promise<User | null> {
    const res = await db.query<UserFields[]>(
      `SELECT id, name, password FROM users WHERE name = '${name}' AND password = '${password}';`
    );
    return res.length
      ? new User(res[0].id, res[0].name, res[0].password)
      : null;
  }
}
