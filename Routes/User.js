const express = require("express");
const router = express.Router();
const User = require("../drivers/User");
const check = require("../middlewares/auth");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

router.get("/test", User.test);
router.post("/register", User.register);
router.post("/login", User.login);
router.get("/getUser/:id", check.auth, User.getUser);
router.get("/getUsers", check.auth, User.getUsers);
router.put("/updateUser", check.auth, User.updateUser);
router.post(
  "/uploadAvatar",
  [check.auth, uploads.single("file0")],
  User.uploadAvatar
);
router.get("/avatar/:file", User.avatar);
router.get("/counts/:id", check.auth, User.counts);

module.exports = router;
