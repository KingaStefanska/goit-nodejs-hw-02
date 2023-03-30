const { User } = require("../models/user");

const getAllUsers = async () => {
  return User.find();
};

const getUserById = async (userId) => {
  return User.findOne({ _id: userId });
};

const getUser = async (body) => {
  return User.findOne(body);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const addUserToken = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
};

const updateUserToken = async (id) => {
  return User.findOneAndUpdate(id, { token: null });
};

module.exports = {
  getUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  addUserToken,
  updateUserToken,
};
