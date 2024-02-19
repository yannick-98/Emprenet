const Follow = require("../models/Follow");

const followUserIds = async (userId) => {
  try {
    const following = await Follow.find({ user: userId }).select({
      _id: 0,
      __v: 0,
      user: 0,
    });
    const followed = await Follow.find({ followed: userId }).select({
      _id: 0,
      __v: 0,
      followed: 0,
    });
    let followingClean = [];
    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });
    let followedClean = [];
    followed.forEach((follow) => {
      followedClean.push(follow.user);
    });
    return {
      following: followingClean,
      followed: followedClean,
    };
  } catch (error) {
    console.log(error);
  }
};

const followThisUser = async (identity_user_id, user_id) => {
  try {
    const following = await Follow.findOne({
      user: identity_user_id,
      followed: user_id,
    });
    const followed = await Follow.findOne({
      user: user_id,
      followed: identity_user_id,
    });
    if (following && followed) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  followUserIds,
  followThisUser,
};
