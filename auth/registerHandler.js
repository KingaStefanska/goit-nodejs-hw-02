const bcrypt = require("bcrypt");
const { User } = require("../models/user");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const registerHandler = async (email, password, subscription) => {
  const hashedPassword = hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    subscription,
  });
  user.save();
  return user;
};

module.exports = { registerHandler };
