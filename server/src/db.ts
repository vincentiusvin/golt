import { createPool } from "mariadb";

export const db = createPool({
  host: "localhost",
  user: "golt",
  password: "golt",
  connectionLimit: 5,
  database: "golt",
});
