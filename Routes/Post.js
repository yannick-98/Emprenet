const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth");
const Post = require("../drivers/Post");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/posts");
  },
  filename: (req, file, cb) => {
    cb(null, "post-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage });

router.post("/createPost", check.auth, Post.createPost);
router.post("/uploadImg/:id", uploads.single("file1"), Post.uploadImg);
router.delete("/deletePost/:id?", check.auth, Post.deletePost);
router.get("/getPosts/:id?", check.auth, Post.getPosts);
router.get("/getPost/:id?", check.auth, Post.getPost);
router.get("/getImg/:file", Post.getImg);
router.get("/feed/:page?", check.auth, Post.feed);

module.exports = router;
