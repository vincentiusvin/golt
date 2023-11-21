import { Code } from "./Code";

export class User {
  username: string;
  code_list: Code[];
  constructor(username: string) {
    this.username = username;
    this.code_list = [new Code("test", username)];
  }
}
