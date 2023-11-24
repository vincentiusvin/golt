import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { db } from "../db";
import { CodeResource } from "../shared_interfaces";

type CodeFields = {
  id: number;
  name: string;
  user_id: number;
};

export class Code {
  id: number;
  name: string;
  user_id: number;

  private constructor(id: number, name: string, user_id: number) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
  }

  private get_base_path() {
    return `compile/${this.user_id}/${this.name}/`;
  }

  private get_code_path() {
    return this.get_base_path() + "code.cpp";
  }

  private get_binary_path() {
    return this.get_base_path() + "code.out";
  }

  private get_output_path() {
    return this.get_base_path() + "status.json";
  }

  get_code() {
    return readFileSync(this.get_code_path(), "utf-8");
  }

  get_output(): CodeOutput {
    return JSON.parse(readFileSync(this.get_output_path(), "utf-8"));
  }

  post_code(code: string) {
    if (!existsSync(this.get_base_path())) {
      mkdirSync(this.get_base_path(), { recursive: true });
    }

    writeFileSync(this.get_code_path(), code);
    const compile = `gcc -g ${this.get_code_path()} -o ${this.get_binary_path()}`;
    const disasm = `objdump -DrwCS -j .text -j .plt -j .rodata ${this.get_binary_path()}`;

    let result: CodeOutput;
    try {
      execSync(compile).toString();
      const output = execSync(disasm).toString();

      result = {
        compile_success: true,
        result: output,
      };
    } catch (error) {
      if (error instanceof Error && "stdout" in error) {
        const output = error.message;

        result = {
          compile_success: false,
          result: output,
        };
      } else {
        result = {
          compile_success: false,
          result: "Unknown Error",
        };
      }
    }
    writeFileSync(this.get_output_path(), JSON.stringify(result));
  }

  to_json(): CodeResource {
    return {
      code: this.get_code(),
      display_name: this.name,
      id: this.id,
      ...this.get_output(),
    };
  }

  static async add_to_db(name: string, user_id: number) {
    const res = await db.query(
      `INSERT INTO codes(name, user_id) VALUES ('${name}', ${user_id});`
    );
    return res;
  }

  static async get_by_id(id: number): Promise<Code | null> {
    const res = await db.query<CodeFields[]>(
      `SELECT id, name, user_id FROM codes WHERE id = ${id};`
    );
    return res.length ? new Code(res[0].id, res[0].name, res[0].user_id) : null;
  }

  static async get_by_user_id(user_id: number): Promise<Code[]> {
    const res = await db.query<CodeFields[]>(
      `SELECT id, name, user_id FROM codes WHERE user_id = ${user_id};`
    );
    return res.map((x) => new Code(x.id, x.name, x.user_id));
  }

  static async get_by_user_id_and_code_id(
    user_id: number,
    code_id: number
  ): Promise<Code | null> {
    const res = await db.query<CodeFields[]>(
      `SELECT id, name, user_id FROM codes WHERE user_id = ${user_id} AND id = ${code_id};`
    );
    return res.length ? new Code(res[0].id, res[0].name, res[0].user_id) : null;
  }

  static async get_by_user_id_and_name(
    user_id: number,
    name: string
  ): Promise<Code | null> {
    const res = await db.query<CodeFields[]>(
      `SELECT id, name, user_id FROM codes WHERE user_id = ${user_id} AND name = '${name}';`
    );
    return res.length ? new Code(res[0].id, res[0].name, res[0].user_id) : null;
  }
}

export type CodeOutput = {
  compile_success: boolean;
  result: string;
};
