import { Code } from "./Code";

export class User {
  username: string;
  password: string;
  code_list: Code[];
  constructor(username: string) {
    this.username = username;
    this.code_list = [new Code("test", username)];
  }
}

export class UserManager {
  logged_in: { [username: string]: User };
  constructor() {
    this.logged_in = {};
  }
  login(username: string, password: string): User | null {
    if (password !== "123") {
      return null;
    }
    if (!this.logged_in[username]) {
      this.logged_in[username] = new User(username);
    }
    return this.logged_in[username];
  }
}
