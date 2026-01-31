const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const { ConnectionRequestModel } = require("../models/connectionRequestModel");
let userRouter = express.Router();
let FIELDS_TO_POPLATE = [
  "firstName",
  "lastName",
  "profilePic",
  "bio",
  "gender",
  "interests",
];

userRouter.get("/v1/getUserRequests", authMiddleware, async (req, res) => {
  try {
    let loggedInUser = req.user;
    let requests = await ConnectionRequestModel.find({
      reciever: loggedInUser._id,
      status: "like",
    }).populate("sender", FIELDS_TO_POPLATE);
    res.status(200).json({
      message: "Successfully fetched the user requests",
      data: requests,
    });
  } catch (error) {
    console.log(`Get User Request error ${error}`);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

userRouter.get("/v1/getUserConnnections", authMiddleware, async (req, res) => {
  try {
    let loggedInUser = req.user;

    let connections = await ConnectionRequestModel.find({
      $or: [
        { reciever: loggedInUser._id, status: "accept" },
        { sender: loggedInUser._id, status: "accept" },
      ],
    })
      .populate("sender", FIELDS_TO_POPLATE)
      .populate("reciever", FIELDS_TO_POPLATE);

    let data = connections.map((row) => {
      // Return the other user (not the logged-in user)
      if (row.sender._id.toString() === loggedInUser._id.toString()) {
        return row.reciever;
      }
      return row.sender;
    });

    res.status(200).json({
      message: "Successfully fetched the connections",
      data,
    });
  } catch (error) {
    console.log(`Get Connections error ${error}`);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

module.exports = { userRouter };
