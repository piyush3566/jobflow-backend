import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "jobflow",
  user: process.env.DB_USER || "jobflow_user",
  password: "jobflow_pass"
});


// Optional logs
pool.on("connect", () => {
  console.log("Connected to PostgreSQL ✅");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

// helper for queries
export const query = (text, params) => pool.query(text, params);

export default pool;
