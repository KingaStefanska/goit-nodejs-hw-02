const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUserByEmail,
  getAllUsers,
  updateUserToken,
} = require("../../controllers/users");
const { registerHandler } = require("../../auth/registerHandler");
const { loginHandler } = require("../../auth/loginHandler");
const { auth } = require("../../auth/auth");
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
    const token = await loginHandler(email, password);
    return res.status(200).send(token);
  } catch (err) {
    return res.status(401).send(err);
  }
});

router.get("/:userId/logout", auth, async (req, res, next) => {
  const user = await getUserById(req.params.userId);
  if (!user) {
    return res.status(401).send("Not authorized");
  }
  await updateUserToken(user, { body: { token: null } });
  return res.status(204).send();
});

router.get("/", auth, async (req, res, next) => {
  const users = await getAllUsers();
  return res.status(200).json(users);
});

router.get("/:userId", auth, async (req, res, next) => {
  const user = await getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.status(200).json(user).send();
});

router.get("/current", auth, async (req, res, next) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.json({ email: user.email, subscription: user.subscription });
});

module.exports = router;
