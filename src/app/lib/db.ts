import mysql from 'mysql2/promise';

const config = {
  host: 'localhost', // Your MySQL server host
  user: 'root', // Your MySQL username
  password: '12345', // Your MySQL password
  database: 'taskProject', // Your MySQL database name
  port: 3306, // The default port for MySQL
};

let pool: mysql.Pool | undefined;

export async function getPool() {
  try {
    if (!pool) {
        pool = mysql.createPool(config);
      }
      return pool;
  } catch (err: any) {
    console.error('Database connection error:', err.message, err.stack);
    throw err;
  }
}
