const { User } = require("../models/user");

const getAllUsers = async () => {
  return User.find();
};

const getUserById = async (userId) => {
  return User.findOne({ _id: userId });
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const updateUserToken = async (userId, body) => {
  return User.findOneAndUpdate({ _id: userId }, body, { new: true });
};

module.exports = { getUserById, getUserByEmail, getAllUsers, updateUserToken };
