const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({
        message: "Invalid Token , please re login",
      });
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findById(id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User does not exist , please login in again" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      message: `Something went wrong => ${error}`,
    });
  }
};

module.exports = { authMiddleware };
