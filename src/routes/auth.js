const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpApi } = require("../utils/validateApi");
const { User } = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const validator = require("validator");

const authRouter = express.Router();

authRouter.post("/v1/signUp", async (req, res) => {
  try {
    validateSignUpApi(req.body);
    let {
      firstName,
      lastName,
      email,
      password,
      bio,
      profilePic,
      age,
      gender,
      interests,
    } = req.body;
    let hashedPassword = await bcrypt.hash(password, 12);
    let user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bio,
      profilePic,
      age,
      gender,
      interests,
    });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      data: {
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    // Validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    // Duplicate key error (email unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists , please choose a differnt email",
      });
    }

    // Unknown errors
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

authRouter.post("/v1/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    let userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    let isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (isPasswordValid) {
      let token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      res.status(200).json({
        message: "User logged in successfully",
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

authRouter.post("/v1/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).json({
    message: "User logged out successfully",
  });
});

authRouter.post("/v1/resetPassword", authMiddleware, async (req, res) => {
  try {
    let user = req.user;
    let { password, newPassword, confirmPassword } = req.body;

    if (!password || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Current password is incorrect , please verify and try again",
      });
    }

    if (password === newPassword) {
      return res.status(400).json({
        message: "New password can not be same as the current password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password does not match confirm password",
      });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: "Password must be strong",
      });
    }

    let hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Reset password Error:", error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

module.exports = { authRouter };
