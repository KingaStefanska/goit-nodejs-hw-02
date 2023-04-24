const gravatar = require("gravatar");
const { uuid } = require("uuidv4");
const nodemailer = require("nodemailer");
const { User } = require("../models/user");
const { hashPassword } = require("../auth/passwordHandler");

const createUser = async (email, password) => {
  const hashedPassword = hashPassword(password);
  const avatarURL = gravatar.url(email, {
    s: "200", //size
    r: "pg", //rating
    d: "mm", //default
  });
  try {
    const user = new User({
      email,
      password: hashedPassword,
      avatarURL,
      verify: false,
      verificationToken: uuid(),
    });
    await user.save();

    const auth = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth,
    });

    const html = `
    <div>
    <h3>Click <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">here</a> to confirm your account</h3>
    </div>
    `;

    const sendEmail = async () => {
      const info = await transporter.sendMail({
        from: { name: "Kinga", address: "foo@example.com" },
        to: user.email,
        subject: "Confirm your account",
        html,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(previewUrl);
    };

    await sendEmail();
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getAllUsers = async () => {
  return User.find();
};

const getUserById = async (userId) => {
  return User.findOne({ _id: userId });
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

const updateAvatar = async (id, avatarURL) =>
  User.findByIdAndUpdate(id, { avatarURL });

const verifyToken = async (verificationToken) => {
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null },
    { new: true }
  );
  return user;
};

const templateHtml = () => {
  const imgUrl =
    "https://cdn.pixabay.com/photo/2020/04/03/07/26/eye-4997724_1280.png";
  return `<h1 style="color:blue"> Hello User</h1><div><a href=${imgUrl}> Take a look</a></div>`;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getAllUsers,
  addUserToken,
  updateUserToken,
  updateAvatar,
  verifyToken,
  templateHtml,
};
