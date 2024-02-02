const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting connection from the pool:", err.message);
    return;
  }
  console.log("Connected to MySQL successfully...");

  // Perform database operations using the connection

  connection.release(); // Release the connection back to the pool
});

module.exports = pool.promise();
