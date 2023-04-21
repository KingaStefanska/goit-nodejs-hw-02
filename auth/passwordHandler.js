const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

module.exports = { hashPassword };
