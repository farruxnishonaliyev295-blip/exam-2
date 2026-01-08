import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
async function db_connect() {
    try {
        await pool.connect()
        console.log("✅ Database connected!")
    } catch (error) {
        console.log(error)
    }
}

db_connect()

export default pool
