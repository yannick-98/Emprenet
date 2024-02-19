const Follow = require("../models/Follow");
const User = require("../models/User");

const follow = async (req, res) => {
  try {
    let params = req.body;
    let user = req.user;
    if (!params.followed) {
      return res.status(400).json({
        message: "User to follow is required",
      });
    }
    let followed = await User.findOne({ _id: params.followed });
    let follower = await User.findOne({ _id: user.id });
    let follow = new Follow({
      user: user.id,
      userData: {
        name: follower.name,
        nickName: follower.nickName,
        createdAt: follower.createdAt,
        avatar: follower.avatar,
      },
      followed: params.followed,
      followedData: {
        name: followed.name,
        nickName: followed.nickName,
        createdAt: followed.createdAt,
        avatar: followed.avatar,
      },
    });
    await follow.save();
    return res.status(200).json({
      status: "success",
      message: "User followed successfully",
      user: user,
      follow,
    });
  } catch (error) {
    return res.status(400).json({
      message: "User follow failed",
      error,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    let params = req.body;
    let user = req.user;
    if (!params.followed) {
      return res.status(400).json({
        message: "User to unfollow is required",
      });
    }
    let follow = await Follow.findOneAndDelete({
      user: user.id,
      followed: params.followed,
    });
    return res.status(200).json({
      status: "success",
      message: "User unfollowed successfully",
      user: user,
      follow,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "User unfollow failed",
      error,
    });
  }
};

const getFollowing = async (req, res) => {
  try {
    let user = req.user;
    let params = req.params;
    if (params.id) {
      user.id = params.id;
    }
    const follows = await Follow.find({ user: user.id }).sort("_id");
    if (!follows) {
      return res.status(401).json({
        message: "Followed users not found",
      });
    }
    let followsClean = [];
    follows.forEach((follow) => {
      followsClean.push(follow);
    });
    const totalFollows = await Follow.countDocuments({ user: user.id });
    if (!totalFollows) {
      return res.status(402).json({
        message: "Followed users not found",
      });
    }
    return res.status(200).json({
      message: "Followed users retrieved successfully",
      totalFollows,
      follows: followsClean,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Followed users retrieve failed",
      error,
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    let params = req.params;
    let user = req.user;
    if (params.id) {
      user.id = params.id;
    }
    const follows = await Follow.find({ followed: user.id }).sort("_id");
    if (!follows) {
      return res.status(401).json({
        message: "Followers not found",
      });
    }
    let followsClean = [];
    follows.forEach((follow) => {
      followsClean.push(follow);
    });
    const totalFollows = await Follow.countDocuments({ followed: user.id });
    if (!totalFollows) {
      console.log("Followers count failed");
    }
    return res.status(200).json({
      message: "Followers retrieved successfully",
      totalFollows,
      follows: followsClean,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Followers retrieve failed",
      error,
    });
  }
};

const getFollow = async (req, res) => {
  try {
    let user = req.user;
    let params = req.params;
    const follow = await Follow.findOne({
      user: params.id,
      followed: params.followed,
    });

    if (!follow.user) {
      return res.status(400).json({
        status: "error",
        message: "Follow not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Follow retrieved successfully",
      follow,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "error",
      message: "Follow retrieve failed",
      error,
    });
  }
};

module.exports = {
  follow,
  unfollow,
  getFollowing,
  getFollowers,
  getFollow,
};
