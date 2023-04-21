const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Jimp = require("jimp");
const jwtSecret = process.env.JWT_SECRET;

const {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  addUserToken,
  updateUserToken,
  updateAvatar,
  verifyToken,
  templateHtml,
} = require("../../controllers/users");
const { auth } = require("../../auth/auth");
const { AVATAR_DIRECTORY, upload } = require("../../common/upload");
const validate = require("../../common/validator");

router.post("/signup", validate.userValid, async (req, res, next) => {
  let { email, password } = req.body;
  const emailInUse = await getUserByEmail(email);
  if (emailInUse) {
    return res.status(409).send("Email is already in use");
  }

  try {
    const newUser = await createUser(email, password);
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).send("Something went wrong");
  }
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
  const { _id } = req.user;
  await updateUserToken(_id);
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

router.patch("/avatars", upload.single("avatar"), async (req, res, next) => {
  const { path: temporaryName } = req.file;
  const avatarURL = path.join(AVATAR_DIRECTORY, req.file.filename);

  Jimp.read(temporaryName)
    .then((avatar) => {
      return avatar.resize(250, 250).write(AVATAR_DIRECTORY);
    })
    .catch((err) => {
      console.error(err);
    });

  try {
    await fs.rename(temporaryName, avatarURL);
    await updateAvatar();
  } catch (e) {
    await fs.unlink(temporaryName);
    next(e);
  }
  res.status(200).json({ avatarURL });
});

router.post("/verify", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Missing required filed mail");
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.verify) {
      return res.status(400).send("Verification has already been passed");
    }

    const authVerify = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: authVerify,
    });

    const sendEmail = async () => {
      const info = await transporter.sendMail({
        from: { name: "Kinga", address: "foo@example.com" },
        to: user.email,
        subject: `Verification ${new Date().toISOString()}`,
        text: "Hello",
        html: templateHtml(),
      });
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(previewUrl);
    };

    await transporter.sendMail(sendEmail);
    res.status(200).send("Verification email sent");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

router.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await verifyToken(verificationToken);

    if (user) {
      return res.status(200).send("Verification succesfull");
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
