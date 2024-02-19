const jwt = require("jwt-simple");
const moment = require("moment");

//Clave secreta
const key = "sskey9862";

//Generar tokens
const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    lastname: user.lastname,
    email: user.email,
    role: user.role,
    plan: user.plan,
    created_at: moment().unix(),
    expired_at: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, key);
};

module.exports = {
  createToken,
  key,
};
