const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const { ConnectionRequestModel } = require("../models/connectionRequestModel");
const { User } = require("../models/userModel.js");
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

    // get all requests where logged in user is the reciever and status is like
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

    //  get all connections where logged in user is either sender or reciever and status is accepted
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

userRouter.get("/v1/getFeed", authMiddleware, async (req, res) => {
  try {
    let usersToBeHiddenFromFeed = new Set();
    let loggedInUser = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    // get all connection where logged in user is either sender or reciever

    let requests = await ConnectionRequestModel.find({
      $or: [{ sender: loggedInUser._id }, { reciever: loggedInUser._id }],
    });

    // add both sender and reciever to the set
    requests.forEach((req) => {
      usersToBeHiddenFromFeed.add(req.sender.toString());
      usersToBeHiddenFromFeed.add(req.reciever.toString());
    });

    // find all the users except the ones in the set and the logged in user
    let users = await User.find({
      $and: [
        { _id: { $nin: Array.from(usersToBeHiddenFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(FIELDS_TO_POPLATE)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Successfully fetched the feed",
      data: users,
    });
  } catch (error) {
    console.log(`Get Feed error ${error}`);
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

module.exports = { userRouter };
