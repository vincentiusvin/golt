import { createPool } from "mariadb";

const { MARIADB_USER, MARIADB_PASSWORD, MARIADB_DATABASE } = process.env;

export const db = createPool({
  host: "localhost",
  user: MARIADB_USER,
  password: MARIADB_PASSWORD,
  connectionLimit: 5,
  database: MARIADB_DATABASE,
});
