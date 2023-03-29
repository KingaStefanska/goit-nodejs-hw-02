const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next, user) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Not authorized");
  }
  try {
    jwt.verify(token, jwtSecret);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Not authorized");
  }
};

module.exports = { auth };
