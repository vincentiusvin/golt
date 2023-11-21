import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

export class Code {
  file_name: string;
  folder_name: string;

  constructor(name: string, folder: string) {
    this.file_name = name;
    this.folder_name = folder;
  }

  private get_base_path() {
    return `compile/${this.folder_name}/${this.file_name}.cpp`;
  }

  private get_code_path() {
    return this.get_base_path() + ".cpp";
  }

  private get_binary_path() {
    return this.get_base_path() + ".out";
  }

  private get_output_path() {
    return this.get_base_path() + ".txt";
  }

  get_code() {
    return readFileSync(this.get_code_path(), "utf-8");
  }

  post_code(code: string) {
    writeFileSync(this.get_code_path(), code);
    const compile = `gcc -g ${this.get_code_path()} -o ${this.get_binary_path()}`;
    const disasm = `objdump -DrwCS -j .text -j .plt -j .rodata ${this.get_binary_path()}`;

    try {
      execFileSync(compile).toString();
      const output = execFileSync(disasm).toString();
      writeFileSync(this.get_output_path(), output);
    } catch (error) {
      const output = error.stderr;
      writeFileSync(this.get_output_path(), output);
    }
  }
}
