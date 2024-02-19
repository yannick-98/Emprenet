const Post = require("../models/Post");
const Follow = require("../models/Follow");
const fs = require("fs");
const path = require("path");

const createPost = async (req, res) => {
  try {
    let params = req.body;
    let user = req.user;

    let post = new Post({
      user: user.id,
      userData: params.userData ? params.userData : null,
      text: params.text ? params.text : null,
    });
    await post.save();
    return res.status(200).json({
      status: "success",
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Post creation failed",
      error,
    });
  }
};

const uploadImg = async (req, res) => {
  try {
    let image = req.file;
    let user = req.user;
    console.log(user);
    if (!image) {
      return res.status(400).json({
        message: "File not found",
      });
    }
    let imageSplit = image.mimetype.split("/");
    let extension = imageSplit[1];
    if (extension !== "png" && extension !== "jpg" && extension !== "jpeg") {
      return res.status(400).json({
        status: "error",
        message: `File format not valid: ${extension}`,
      });
    }
    if (image.size > 10000000) {
      return res.status(400).json({
        status: "error",
        message: `File size not valid: ${image.size}`,
      });
    }

    let post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { file: req.file.filename },
      { new: true }
    );

    if (!post) {
      return res.status(400).json({
        status: "error",
        message: "Post not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "File uploaded",
      post,
      file: req.file.originalname,
      files: req.files,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    let params = req.params;
    if (!params.id) {
      return res.status(400).json({
        message: "Missing params",
      });
    }
    let user = req.user;
    const post = await Post.findOneAndDelete({
      _id: params.id,
      user: user.id,
    });
    if (!post.length) {
      return res.status(400).json({
        message: "Post not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
      user: user.name,
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Post deletion failed",
      error,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    let user = req.user;
    let params = req.params;
    if (params.id) {
      // const following = await Follow.find({
      //   user: user.id,
      //   followed: params.id,
      // });
      // if (!following.length && user.id !== params.id) {
      //   console.log("user not followed");
      //   return res.status(400).json({
      //     status: "error",
      //     message: "User not followed",
      //   });
      // }
      user.id = params.id;
    }

    const posts = await Post.find({ user: user.id })
      .sort("-createdAt")
      .select("text file createdAt");
    if (!posts.length) {
      console.log("posts not found");
      return res.status(400).json({
        message: "Posts not found",
      });
    }
    let postsClean = [];
    posts.forEach((post) => {
      postsClean.push({
        _id: post._id,
        user: post.user,
        nickname: user.nickname,
        text: post.text,
        file: post.file,
        createdAt: post.createdAt,
      });
    });
    const totalPosts = await Post.countDocuments();
    return res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      user,
      totalPosts,
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Post fetch failed",
      error,
    });
  }
};

const getPost = async (req, res) => {
  try {
    let params = req.params;
    let user = req.user;
    if (params.id) {
      const following = await Follow.find({
        user: user.id,
        followed: params.id,
      });
      if (!following.length) {
        return res.status(400).json({
          status: "error",
          message: "User not followed",
        });
      }
      user.id = params.id;
    }
    const post = await Post.findById(user.id).select("text file createdAt");
    if (!post.length) {
      return res.status(400).json({
        message: "Post not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Post retrieved successfully",
      user: user.name,
      post,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Post fetch failed",
      error,
    });
  }
};

const getImg = async (req, res) => {
  try {
    const file = req.params.file;
    const pathFile = `./uploads/posts/${file}`;
    fs.stat(pathFile, (error, exists) => {
      if (!exists) {
        return res.status(400).json({
          status: "error",
          message: "File not found",
          error,
        });
      }
      return res.sendFile(path.resolve(pathFile));
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const feed = async (req, res) => {
  const user = req.user;

  try {
    const follows = await Follow.find({ user: user.id }).populate("followed");
    const followsClean = [];
    follows.forEach((follow) => {
      followsClean.push(follow.followed);
    });
    followsClean.push(user.id);
    const posts = await Post.find({ user: { $in: followsClean } })
      .sort("-createdAt")
      .populate("user text file createdAt");
    if (!posts.length) {
      return res.status(400).json({
        message: "Posts not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Posts retrieved successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Post fetch failed",
      error,
    });
  }
};

module.exports = {
  createPost,
  uploadImg,
  deletePost,
  getPosts,
  getPost,
  getImg,
  feed,
};
