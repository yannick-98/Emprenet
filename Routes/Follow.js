const express = require("express");
const router = express.Router();
const Follow = require("../drivers/Follow");
const check = require("../middlewares/auth");

router.post("/follow", check.auth, Follow.follow);
router.delete("/unfollow", check.auth, Follow.unfollow);
router.get("/following/:id?", check.auth, Follow.getFollowing);
router.get("/followers/:id?", check.auth, Follow.getFollowers);
router.get("/getFollow/:id/:followed", check.auth, Follow.getFollow);

module.exports = router;
