const express = require("express");
const { User } = require("../models/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");

const profileRouter = express.Router();

profileRouter.get("/v1/getMyProfile", authMiddleware, (req, res) => {
  let user = req.user;
  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    age: user.age,
    gender: user.gender,
    interests: user.interests,
  });
});

profileRouter.get("/v1/getAllProfiles", authMiddleware, async (req, res) => {
  try {
    let users = await User.find({});
    res.status(200).json({
      message: "Fetched the users successfully",
      data: users,
    });
  } catch (error) {
    console.log(`GetAllUsers error => ${error}`);
    res.status(400).json({
      message: `Something went wrong`,
    });
  }
});

profileRouter.put(
  "/v1/updateMyProfile/:id",
  authMiddleware,
  async (req, res) => {
    try {
      let user = req.user;
      let { id } = req.params;
      let data = req.body;
      let allowedFieldsToUpdate = [
        "firstName",
        "lastName",
        "bio",
        "profilePic",
        "age",
      ];
      if (id !== user._id.toString()) {
        return res.status(400).json({
          message: "You are not authorized to update this user",
        });
      }
      let isUpdatable = Object.keys(data).every((key) =>
        allowedFieldsToUpdate.includes(key),
      );
      if (isUpdatable) {
        let updatedUser = await User.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        });
        res.status(201).json({
          message: "User updated successfully",
          data: {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            bio: updatedUser.bio,
          },
        });
      } else {
        return res.status(400).json({
          message: "You are trying to update non updatable fields",
        });
      }
    } catch (error) {
      console.log(`updateMyProfile error => ${error}`);
      res.status(400).json({
        message: `Something went wrong`,
      });
    }
  },
);

module.exports = { profileRouter };
