const express = require("express");
const router = express.Router();
const Chat = require("../drivers/Chat");
const check = require("../middlewares/auth");

router.post("/NewChat", check.auth, Chat.newChat);
router.post("/NewMessage/:id", check.auth, Chat.newMessage);
router.get("/GetChats", check.auth, Chat.getChats);
router.get("/GetChat/:id", check.auth, Chat.getChat);
router.delete("/DeleteChat/:id", check.auth, Chat.deleteChat);

module.exports = router;
