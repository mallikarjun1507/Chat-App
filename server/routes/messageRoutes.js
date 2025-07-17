const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  createMessage,
} = require("../controllers/messageController");

router.get("/", getAllMessages);
router.post("/", createMessage);

module.exports = router;
