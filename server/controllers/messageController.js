const Message = require("../models/messageModel");

exports.getAllMessages = (req, res) => {
  Message.getMessages((err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.createMessage = (req, res) => {
  const { sender, content } = req.body;
  console.log("hjkhjkahsdkjhas")
  Message.saveMessage(sender, content, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Message saved successfully." });
  });
};
