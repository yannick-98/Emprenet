const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const fs = require("fs");
const path = require("path");

const test = (req, res) => {
  return res.status(200).json({
    message: "This is a test route",
  });
};

const register = async (req, res) => {
  try {
    let params = req.body;
    console.log("params");

    if (!params.name || !params.nickName || !params.email || !params.password) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }
    console.log("validation");

    const findNick = await User.findOne({ nickName: params.nickName });
    const findEmail = await User.findOne({ email: params.email });
    if (findNick) {
      return res.status(400).json({
        message: "Nickname already exists",
      });
    }
    if (findEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    console.log("find");

    const pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;
    console.log("pwd");

    const user = new User(params);
    await user.save();
    console.log("save");

    return res.status(200).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User registration failed",
      error,
    });
  }
};

const login = async (req, res) => {
  try {
    let params = req.body;

    if (!params.email || !params.password) {
      return res.status(400).json({
        status: "error",
        message: "Missing params",
      });
    }

    const user = await User.findOne({ email: params.email });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    if (!bcrypt.compareSync(params.password, user.password)) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.createToken(user);

    user.password = undefined;

    return res.status(200).json({
      message: "User logged",
      user: {
        id: user._id,
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: user._id,
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        createdAt: user.createdAt,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort("_id");
    if (!users) {
      return res.status(400).json({
        message: "Users not found",
      });
    }
    const totalUsers = await User.countDocuments();
    let usersClean = [];
    users.forEach((user) => {
      user.password = undefined;
      usersClean.push(user);
    });
    console.log("usersClean:" + usersClean);
    return res.status(200).json({
      status: "success",
      message: "Users found",
      totalUsers,
      users: usersClean,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    let params = req.body;
    let userId = req.user.id;

    if (!params.name && !params.nickName && !params.email && !params.password) {
      console.log("missing.params");
      return res.status(400).json({
        message: "Missing params",
      });
    }

    if (params.password) {
      const pwd = bcrypt.hashSync(params.password, 10);
      params.password = pwd;
    } else {
      delete params.password;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        name: params.name,
        nickName: params.nickName,
        email: params.email,
        password: params.password,
        avatar: params.avatar,
      },
      { new: true }
    );

    if (!user) {
      console.log("user not found");
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated",
      user: {
        id: user._id,
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("error");
    return res.status(400).json({
      message: "Error",
      error,
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    let image = req.file.filename;
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
    if (image.size > 1000000) {
      return res.status(400).json({
        status: "error",
        message: `File size not valid: ${image.size}`,
      });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { avatar: req.file.filename },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Avatar uploaded",
      user: {
        id: user._id,
        name: user.name,
        nickName: user.nickName,
        email: user.email,
        avatar: user.avatar,
      },
      file: req.file,
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

const avatar = async (req, res) => {
  try {
    const file = req.params.file;
    const pathFile = `./uploads/avatars/${file}`;
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
    return res.status(400).json({
      status: "error",
      message: "Error",
      error,
    });
  }
};

const counts = async (req, res) => {
  try {
    const id = req.params.id;
    const following = await Follow.countDocuments({ user: id });
    const followers = await Follow.countDocuments({ followed: id });
    const posts = await Post.countDocuments({ user: id });

    return res.status(200).json({
      status: "success",
      message: "Counts",
      counts: {
        following,
        followers,
        posts,
      },
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

module.exports = {
  register,
  test,
  login,
  getUser,
  getUsers,
  updateUser,
  uploadAvatar,
  avatar,
  counts,
};
