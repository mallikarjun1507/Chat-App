const db = require("../config/db");

exports.saveMessage = (sender, content, callback) => {
  db.query(
    "INSERT INTO messages (sender, content) VALUES (?, ?)",
    [sender, content],
    callback
  );
};

exports.getMessages = (callback) => {
  db.query("SELECT * FROM messages ORDER BY id ASC", callback);
};
