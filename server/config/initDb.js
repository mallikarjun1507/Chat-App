const mysql = require("mysql2");
require("dotenv").config();

const initDb = () => {
  return new Promise((resolve, reject) => {
    // Step 1: Create DB
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
      if (err) {
        connection.end();
        return reject(err);
      }

      console.log(`✅ Database '${process.env.DB_NAME}' created or already exists.`);

      // Step 2: Connect to created DB
      const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS messages (
          id INT NOT NULL AUTO_INCREMENT,
          sender VARCHAR(100) DEFAULT NULL,
          content TEXT,
          created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
      `;

      const insertMessagesQuery = `
        INSERT INTO messages (id, sender, content, created_at) VALUES
          (1, 'arjun', 'hii', '2025-07-30 09:23:26'),
          (2, 'arjun', 'hlo', '2025-07-30 09:23:34'),
          (3, 'ankit', 'hey arjun', '2025-07-30 09:23:55'),
          (4, 'madhu', 'hello', '2025-08-01 14:56:22'),
          (5, 'madhu', 'hii', '2025-08-01 14:56:27')
        ON DUPLICATE KEY UPDATE
          sender = VALUES(sender),
          content = VALUES(content),
          created_at = VALUES(created_at);
      `;

      db.query(createTableQuery, (err) => {
        if (err) {
          db.end();
          return reject(err);
        }

        console.log("✅ Table 'messages' created or already exists.");

        db.query(insertMessagesQuery, (err) => {
          db.end();
          if (err) return reject(err);
          console.log("✅ Initial message data inserted.");
          resolve();
        });
      });
    });
  });
};

module.exports = initDb;
