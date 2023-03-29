const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const registerHandler = async (email, password, subscription) => {
  const hashedPassword = hashPassword(password);
  return User.create({ email, password: hashedPassword, subscription });
};

module.exports = { registerHandler };
