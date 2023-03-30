const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const {
  getUserById,
  getUserByEmail,
  getAllUsers,
  addUserToken,
  updateUserToken,
  getUser,
} = require("../../controllers/users");
const { registerHandler } = require("../../auth/registerHandler");
const { auth } = require("../../auth/auth");
const { User } = require("../../models/user");
const validate = require("../../common/validator");

router.post("/signup", validate.userValid, async (req, res, next) => {
  let { email, password, subscription } = req.body;
  const emailInUse = await getUserByEmail(email);
  if (emailInUse) {
    return res.status(409).send("Email is already in use");
  }
  const newUser = await registerHandler(email, password, subscription);
  res.status(201).json({ data: { newUser } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  try {
    const user = await getUserByEmail(email);
    const userPassword = user.password;
    const validPassword = bcrypt.compareSync(password, userPassword);
    if (!user || !validPassword)
      return res.status(401).json({ message: "Email or password is wrong" });
    const { id, subscription } = user;
    const payload = { id: id, email: email };
    const token = jwt.sign(payload, jwtSecret);
    await addUserToken(id, token);
    res.status(200).json({
      token,
      user: {
        email,
        subscription,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).send(err);
  }
});

router.get("/logout", auth, async (req, res, next) => {
  const { id } = req.user;
  await updateUserToken(id);
  return res.status(204).send();
});

router.get("/", auth, async (req, res, next) => {
  const users = await getAllUsers();
  return res.status(200).json(users);
});

router.get("/current", auth, async (req, res, next) => {
  const { id } = req.user;
  const user = await getUserById(id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  } else {
    res.status(200).json({ data: user });
  }
});

router.get("/:userId", auth, async (req, res, next) => {
  const user = await getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(user).send();
});

module.exports = router;
