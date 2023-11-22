import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { CodeStatus } from "../shared_interfaces";

export class Code {
  file_name: string;
  folder_name: string;

  constructor(file_name: string, folder_name: string) {
    this.file_name = file_name;
    this.folder_name = folder_name;
  }

  private get_base_path() {
    return `compile/${this.folder_name}/${this.file_name}/`;
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
        status: CodeStatus.Success,
        result: output,
      };
    } catch (error) {
      const output = error.stdout.toString();

      result = {
        status: CodeStatus.CompileError,
        result: output,
      };
    }
    writeFileSync(this.get_output_path(), JSON.stringify(result));
  }
}

export type CodeOutput = {
  status: CodeStatus;
  result: string;
};
