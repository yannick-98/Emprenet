const jwt = require("jwt-simple");
const moment = require("moment");
const jwtLib = require("../services/jwt");
const key = jwtLib.key;

exports.auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({
      message: "Missing auth headers",
    });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    let payload = jwt.decode(token, key);

    if (payload.expired_at <= moment().unix()) {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    req.user = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
